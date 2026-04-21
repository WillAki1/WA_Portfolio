import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTION_HEADINGS = [
  "Weekly Summary",
  "What's Working",
  "What's Not Working",
  "Key Patterns",
  "Recommendations for Next Week",
];

function parseSections(report: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < SECTION_HEADINGS.length; i++) {
    const heading = SECTION_HEADINGS[i];
    // Build a regex that grabs text after this heading until the next heading or end
    const next = SECTION_HEADINGS.slice(i + 1).map((h) =>
      h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const stop = next.length ? `(?=${next.map((n) => `\\*{0,2}${n}`).join("|")})` : "$";
    const re = new RegExp(
      `\\*{0,2}${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\*{0,2}\\s*:?\\s*([\\s\\S]*?)${stop}`,
      "i"
    );
    const m = report.match(re);
    if (m && m[1]) {
      out[heading] = m[1].trim().replace(/^[-–—]\s*/, "").substring(0, 1024);
    }
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!DISCORD_WEBHOOK_URL) {
    return new Response(JSON.stringify({ error: "DISCORD_WEBHOOK_URL is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new Response(JSON.stringify({ error: "Supabase env vars not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const sinceIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [appsRes, visitsRes] = await Promise.all([
      supabase.from("applications").select("*").gte("date_applied", sinceIso),
      supabase.from("portfolio_visits").select("*").gte("visited_at", sinceIso),
    ]);

    if (appsRes.error) throw new Error(`applications query: ${appsRes.error.message}`);
    if (visitsRes.error) throw new Error(`portfolio_visits query: ${visitsRes.error.message}`);

    const applications = appsRes.data || [];
    const visits = visitsRes.data || [];

    const totalApps = applications.length;
    const totalViews = visits.length;
    const responded = applications.filter((a) =>
      ["viewed", "interviewed", "offer"].includes(String(a.status))
    ).length;
    const responseRate = totalApps > 0 ? Math.round((responded / totalApps) * 100) : 0;

    // Compact data payload for Claude
    const compactApps = applications.map((a) => ({
      company: a.company,
      job_title: a.job_title,
      platform: a.platform,
      seniority: a.seniority,
      status: a.status,
      date_applied: a.date_applied,
      view_count: a.view_count,
      date_viewed: a.date_viewed,
    }));
    const compactVisits = visits.map((v) => ({
      company: v.company,
      device: v.device,
      location: v.location,
      referrer: v.referrer,
      visited_at: v.visited_at,
      visit_number: v.visit_number,
      is_repeat: v.is_repeat,
    }));

    const dataBlob = JSON.stringify({
      window: { since: sinceIso, until: new Date().toISOString() },
      stats: { totalApps, totalViews, responseRate },
      applications: compactApps,
      portfolio_visits: compactVisits,
    });

    const prompt = `You are a job search intelligence analyst. Analyse this data from the past 7 days of job applications and portfolio visits and write a concise, genuinely insightful report. Be specific and actionable, not generic. Data: ${dataBlob}. Return a report with these sections: Weekly Summary, What's Working, What's Not Working, Key Patterns, Recommendations for Next Week. Keep each section to 2-3 sentences maximum.`;

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error("Claude API error:", claudeRes.status, errText);
      return new Response(
        JSON.stringify({ error: `Claude API error [${claudeRes.status}]` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const claudeData = await claudeRes.json();
    const reportText: string = claudeData.content?.[0]?.text || "";
    const sections = parseSections(reportText);

    const fields: Array<{ name: string; value: string; inline?: boolean }> = [
      { name: "📨 Applications Sent", value: String(totalApps), inline: true },
      { name: "👀 Portfolio Views", value: String(totalViews), inline: true },
      { name: "📈 Response Rate", value: `${responseRate}%`, inline: true },
    ];

    for (const heading of SECTION_HEADINGS) {
      const value = sections[heading];
      if (value) {
        fields.push({ name: heading, value, inline: false });
      }
    }

    // Fallback: if parsing failed, dump the whole report
    if (Object.keys(sections).length === 0 && reportText) {
      fields.push({ name: "Report", value: reportText.substring(0, 1024), inline: false });
    }

    const embed = {
      title: "🧠 Weekly Job Search Intelligence Report",
      color: 0x1d9e75,
      fields,
      footer: { text: `Window: last 7 days · ${new Date().toLocaleDateString("en-GB")}` },
      timestamp: new Date().toISOString(),
    };

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      throw new Error(`Discord API error [${discordRes.status}]: ${errText}`);
    }
    await discordRes.text().catch(() => {});

    return new Response(
      JSON.stringify({
        success: true,
        stats: { totalApps, totalViews, responseRate },
        sections: Object.keys(sections),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in weekly-report:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
