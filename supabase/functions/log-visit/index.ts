import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company, jobTag, referrer, device, location, visitedAt } = await req.json();

    if (!company) {
      return new Response(
        JSON.stringify({ error: "company is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check previous visits from this company
    const { data: previous, error: fetchErr } = await supabase
      .from("portfolio_visits")
      .select("id, visit_number")
      .eq("company", company)
      .order("visit_number", { ascending: false })
      .limit(1);

    if (fetchErr) throw fetchErr;

    const isRepeat = previous && previous.length > 0;
    const visitNumber = isRepeat ? previous[0].visit_number + 1 : 1;

    // Insert the visit
    const { error: insertErr } = await supabase.from("portfolio_visits").insert({
      company,
      job_tag: jobTag || null,
      referrer: referrer || null,
      device: device || null,
      location: location || null,
      visited_at: visitedAt || new Date().toISOString(),
      is_repeat: isRepeat,
      visit_number: visitNumber,
    });

    if (insertErr) throw insertErr;

    // Update matching application if jobTag provided
    if (jobTag) {
      const { data: apps } = await supabase
        .from("applications")
        .select("id, view_count")
        .ilike("tracking_link", `%${jobTag}%`);

      if (apps && apps.length > 0) {
        const app = apps[0];
        await supabase
          .from("applications")
          .update({
            date_viewed: new Date().toISOString(),
            view_count: app.view_count + 1,
          })
          .eq("id", app.id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, visitNumber }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in log-visit:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
