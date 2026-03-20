import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL");
  if (!DISCORD_WEBHOOK_URL) {
    return new Response(
      JSON.stringify({ error: "DISCORD_WEBHOOK_URL is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { page, referrer, userAgent, timestamp } = await req.json();

    const now = new Date(timestamp || Date.now());
    const timeStr = now.toLocaleString("en-GB", { timeZone: "UTC" });

    const embed = {
      title: "👀 New Portfolio Visitor",
      color: 0x5865f2,
      fields: [
        { name: "📄 Page", value: String(page || "/").substring(0, 1024), inline: true },
        { name: "🕐 Time (UTC)", value: timeStr, inline: true },
        { name: "🔗 Referrer", value: String(referrer || "Direct").substring(0, 1024), inline: false },
        { name: "🖥️ User Agent", value: String(userAgent || "Unknown").substring(0, 200), inline: false },
      ],
      footer: { text: "Portfolio Visitor Tracker" },
      timestamp: now.toISOString(),
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

    // Consume body
    await discordRes.text().catch(() => {});

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending Discord notification:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
