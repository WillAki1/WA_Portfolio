import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── Company detection ────────────────────────────────────────────────────────

const PLATFORM_PATTERNS: { pattern: RegExp }[] = [
  { pattern: /greenhouse\.io\/(?:jobs|applications)?\/?([a-z0-9_-]+)/i },
  { pattern: /boards\.eu\.greenhouse\.io\/([a-z0-9_-]+)/i },
  { pattern: /lever\.co\/([a-z0-9_-]+)/i },
  { pattern: /ashbyhq\.com\/([a-z0-9_-]+)/i },
  { pattern: /jobs\.workday\.com\/([a-z0-9_-]+)/i },
  { pattern: /apply\.workable\.com\/([a-z0-9_-]+)/i },
  { pattern: /jobs\.smartrecruiters\.com\/([a-z0-9_-]+)/i },
  { pattern: /linkedin\.com\/company\/([a-z0-9_-]+)/i },
];

const KNOWN_DOMAINS: { pattern: RegExp; label: string }[] = [
  { pattern: /google\.com/, label: "Google" },
  { pattern: /amazon\.com|amazon\.jobs/, label: "Amazon" },
  { pattern: /microsoft\.com/, label: "Microsoft" },
  { pattern: /apple\.com/, label: "Apple" },
  { pattern: /meta\.com|facebook\.com/, label: "Meta" },
  { pattern: /deloitte\.com/, label: "Deloitte" },
  { pattern: /kpmg\.com/, label: "KPMG" },
  { pattern: /pwc\.com/, label: "PwC" },
  { pattern: /ey\.com/, label: "EY" },
  { pattern: /mckinsey\.com/, label: "McKinsey" },
  { pattern: /bain\.com/, label: "Bain" },
  { pattern: /bcg\.com/, label: "BCG" },
  { pattern: /goldmansachs\.com/, label: "Goldman Sachs" },
  { pattern: /jpmorgan\.com/, label: "JPMorgan" },
  { pattern: /barclays\.com/, label: "Barclays" },
  { pattern: /hsbc\.com/, label: "HSBC" },
  // Add more company domains here as you spot unknowns in Discord:
  // { pattern: /yourcompany\.com/, label: "Your Company" },
];

function platformLabel(referrer: string): string {
  if (/greenhouse/i.test(referrer)) return "Greenhouse";
  if (/lever/i.test(referrer)) return "Lever";
  if (/ashby/i.test(referrer)) return "Ashby";
  if (/workday/i.test(referrer)) return "Workday";
  if (/workable/i.test(referrer)) return "Workable";
  if (/smartrecruiters/i.test(referrer)) return "SmartRecruiters";
  if (/linkedin/i.test(referrer)) return "LinkedIn";
  return "";
}

function detectCompany(referrer: string): string {
  if (!referrer || referrer === "Direct") return "Unknown — direct link";

  // 1. Job platforms — extract company slug from URL
  for (const { pattern } of PLATFORM_PATTERNS) {
    const match = referrer.match(pattern);
    if (match?.[1]) {
      const name = match[1]
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      const platform = platformLabel(referrer);
      return platform ? `${name} via ${platform}` : name;
    }
  }

  // 2. Generic LinkedIn (company name not extractable from URL)
  if (/linkedin\.com/i.test(referrer)) {
    return "Unknown — via LinkedIn";
  }

  // 3. Known company domains
  for (const { pattern, label } of KNOWN_DOMAINS) {
    if (pattern.test(referrer)) return label;
  }

  // 4. Fall back to raw domain
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Unknown";
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL");
  if (!DISCORD_WEBHOOK_URL) {
    return new Response(JSON.stringify({ error: "DISCORD_WEBHOOK_URL is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { page, referrer, userAgent, deviceType, timestamp } = await req.json();

    // Detect company from referrer
    const company = detectCompany(referrer || "");

    // Geolocation (best-effort, unchanged from your original)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "Unknown";

    let location = "Unknown";
    try {
      if (clientIp && clientIp !== "Unknown" && clientIp !== "127.0.0.1") {
        const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=city,country,status`);
        const geoData = await geoRes.json();
        if (geoData.status === "success") {
          location = [geoData.city, geoData.country].filter(Boolean).join(", ") || "Unknown";
        }
      }
    } catch {
      // Geolocation is best-effort
    }

    const now = new Date(timestamp || Date.now());
    const timeStr = now.toLocaleString("en-GB", { timeZone: "UTC" });

    const embed = {
      title: "👤 New Portfolio Visitor",
      color: 0x5865f2,
      fields: [
        { name: "🏢 Company", value: company, inline: false },
        { name: "📄 Page", value: String(page || "/").substring(0, 1024), inline: true },
        { name: "🕐 Time (UTC)", value: timeStr, inline: true },
        { name: "📱 Device", value: String(deviceType || "Unknown"), inline: true },
        { name: "📍 Location", value: location.substring(0, 1024), inline: true },
        { name: "🔗 Referrer", value: String(referrer || "Direct").substring(0, 1024), inline: false },
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
