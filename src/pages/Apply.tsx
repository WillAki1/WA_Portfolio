import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DarkModeToggle from "@/components/DarkModeToggle";
import {
  Lock,
  Link as LinkIcon,
  Copy,
  Loader2,
  CheckCircle2,
  Briefcase,
  Eye,
  TrendingUp,
  Clock,
  ArrowLeft,
  LayoutDashboard,
  Plus,
  Settings,
  X,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";

const PASSWORD = "WPortfolio";

type Application = {
  id: string;
  company: string;
  job_title: string;
  salary: string | null;
  deadline: string | null;
  seniority: string | null;
  platform: string | null;
  job_url: string;
  tracking_link: string;
  status: string;
  date_applied: string;
  date_viewed: string | null;
  view_count: number;
  notes: string | null;
};

type PortfolioVisit = {
  id: string;
  company: string;
  job_tag: string | null;
  referrer: string | null;
  device: string | null;
  location: string | null;
  visited_at: string;
  is_repeat: boolean;
  visit_number: number;
};

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-muted text-muted-foreground",
  viewed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  interviewed: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  offer: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const STATUSES = ["applied", "viewed", "interviewed", "offer", "rejected"];

function slugify(company: string, title: string): string {
  return `${company}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Password Gate ───
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem("apply-auth", "1");
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 border border-border rounded-none bg-card">
          <Lock className="w-7 h-7 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl text-foreground">Private Area</h1>
        <p className="text-sm text-muted-foreground">Enter the password to continue.</p>
        <Input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className={`text-center font-mono ${error ? "border-destructive" : ""}`}
          autoFocus
        />
        {error && <p className="text-sm text-destructive">Incorrect password</p>}
        <Button type="submit" className="w-full">
          Unlock
        </Button>
      </form>
    </div>
  );
}

// ─── Job Analyser ───
function JobAnalyser({ onSaved }: { onSaved: () => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, string | null> | null>(null);
  const [trackingLink, setTrackingLink] = useState("");
  const [saved, setSaved] = useState(false);

  const analyse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    setTrackingLink("");

    try {
      const { data, error } = await supabase.functions.invoke("analyse-job", {
        body: { url: url.trim() },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Analysis failed");

      const d = data.data;
      setResult(d);

      const slug = slugify(d.company || "unknown", d.jobTitle || "role");
      const link = `https://portfolio.william-akitikori.workers.dev?job=${slug}`;
      setTrackingLink(link);

      // Save to DB
      const { error: insertErr } = await supabase.from("applications").insert({
        company: d.company || "Unknown",
        job_title: d.jobTitle || "Unknown",
        salary: d.salary,
        deadline: d.deadline,
        seniority: d.seniority,
        platform: d.platform,
        job_url: url.trim(),
        tracking_link: link,
        status: "applied",
      });

      if (insertErr) throw insertErr;
      setSaved(true);
      toast.success("Application saved!");
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(trackingLink);
    toast.success("Tracking link copied!");
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl text-foreground">Job Analyser</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Paste a job posting URL to extract details and generate a tracking link.
        </p>
      </div>

      <form onSubmit={analyse} className="flex gap-3">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://jobs.lever.co/company/role-id"
          type="url"
          required
          className="flex-1 font-mono text-sm"
        />
        <Button type="submit" disabled={loading} className="shrink-0 gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
          Generate
        </Button>
      </form>

      {result && (
        <div className="border border-border bg-card p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              ["Company", result.company],
              ["Job Title", result.jobTitle],
              ["Salary", result.salary],
              ["Deadline", result.deadline],
              ["Seniority", result.seniority],
              ["Platform", result.platform],
            ].map(([label, val]) => (
              <div key={label as string}>
                <p className="text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
                <p className="text-foreground font-medium mt-0.5">{(val as string) || "—"}</p>
              </div>
            ))}
          </div>

          {trackingLink && (
            <div className="flex items-center gap-2 bg-muted p-3">
              <code className="text-xs font-mono text-foreground flex-1 truncate">{trackingLink}</code>
              <Button size="sm" variant="outline" onClick={copyLink} className="gap-1.5 shrink-0">
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Saved to applications
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Stats Row ───
function StatsRow({
  applications,
  visits,
}: {
  applications: Application[];
  visits: PortfolioVisit[];
}) {
  const total = applications.length;
  const viewed = applications.filter((a) => a.view_count > 0).length;
  const responseRate = total > 0 ? Math.round((viewed / total) * 100) : 0;

  const avgResponseDays = useMemo(() => {
    const withViews = applications.filter((a) => a.date_viewed && a.date_applied);
    if (withViews.length === 0) return "—";
    const totalDays = withViews.reduce((sum, a) => {
      const applied = new Date(a.date_applied).getTime();
      const viewedAt = new Date(a.date_viewed!).getTime();
      return sum + (viewedAt - applied) / (1000 * 60 * 60 * 24);
    }, 0);
    return (totalDays / withViews.length).toFixed(1);
  }, [applications]);

  const stats = [
    { label: "Total Applications", value: total, icon: Briefcase },
    { label: "Portfolio Views", value: visits.length, icon: Eye },
    { label: "Response Rate", value: `${responseRate}%`, icon: TrendingUp },
    { label: "Avg Response Time", value: avgResponseDays === "—" ? "—" : `${avgResponseDays}d`, icon: Clock },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="border border-border bg-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <s.icon className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wide">{s.label}</span>
          </div>
          <p className="text-2xl font-display text-foreground">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Applications Table ───
function ApplicationsTable({
  applications,
  onStatusChange,
}: {
  applications: Application[];
  onStatusChange: (id: string, status: string) => void;
}) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    if (!filter) return applications;
    const q = filter.toLowerCase();
    return applications.filter(
      (a) =>
        a.company.toLowerCase().includes(q) ||
        a.job_title.toLowerCase().includes(q) ||
        (a.platform || "").toLowerCase().includes(q) ||
        (a.seniority || "").toLowerCase().includes(q)
    );
  }, [applications, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl text-foreground">Applications</h2>
        <Input
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs text-sm"
        />
      </div>
      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["Company", "Job Title", "Salary", "Seniority", "Platform", "Applied", "Viewed", "Views", "Status"].map(
                (h) => (
                  <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-muted-foreground">
                  No applications yet
                </td>
              </tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2.5 font-medium text-foreground">{a.company}</td>
                <td className="px-3 py-2.5 text-foreground">{a.job_title}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{a.salary || "—"}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{a.seniority || "—"}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{a.platform || "—"}</td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                  {new Date(a.date_applied).toLocaleDateString("en-GB")}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                  {a.date_viewed ? new Date(a.date_viewed).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">{a.view_count}</td>
                <td className="px-3 py-2.5">
                  <Select
                    value={a.status}
                    onValueChange={(val) => onStatusChange(a.id, val)}
                  >
                    <SelectTrigger className="h-7 w-[120px] border-0 p-0 shadow-none focus:ring-0">
                      <Badge className={`${STATUS_COLORS[a.status] || STATUS_COLORS.applied} text-xs px-2 py-0.5 rounded-none font-medium`}>
                        {a.status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          <Badge className={`${STATUS_COLORS[s]} text-xs px-2 py-0.5 rounded-none font-medium`}>
                            {s}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Activity Heatmap ───
function ActivityHeatmap({ visits }: { visits: PortfolioVisit[] }) {
  const heatmapData = useMemo(() => {
    const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    visits.forEach((v) => {
      const d = new Date(v.visited_at);
      grid[d.getDay()][d.getHours()]++;
    });
    return grid;
  }, [visits]);

  const maxVal = Math.max(1, ...heatmapData.flat());
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl text-foreground">Visit Activity</h2>
      <div className="border border-border bg-card p-4 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="flex gap-0.5 mb-1 ml-10">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground">
                {i % 4 === 0 ? `${i}h` : ""}
              </div>
            ))}
          </div>
          {days.map((day, di) => (
            <div key={day} className="flex gap-0.5 items-center">
              <span className="w-10 text-xs text-muted-foreground text-right pr-2">{day}</span>
              {heatmapData[di].map((count, hi) => {
                const intensity = count / maxVal;
                return (
                  <div
                    key={hi}
                    className="flex-1 aspect-square rounded-none"
                    style={{
                      backgroundColor:
                        count === 0
                          ? "hsl(var(--muted))"
                          : `hsl(6 82% 54% / ${0.15 + intensity * 0.85})`,
                    }}
                    title={`${day} ${hi}:00 — ${count} visit${count !== 1 ? "s" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Interview Insights ───
function InterviewInsights({ applications }: { applications: Application[] }) {
  const insights = useMemo(() => {
    const byPlatform: Record<string, { total: number; responded: number }> = {};
    const bySeniority: Record<string, { total: number; responded: number }> = {};

    applications.forEach((a) => {
      const plat = a.platform || "Other";
      const sen = a.seniority || "Unknown";

      if (!byPlatform[plat]) byPlatform[plat] = { total: 0, responded: 0 };
      byPlatform[plat].total++;
      if (a.view_count > 0) byPlatform[plat].responded++;

      if (!bySeniority[sen]) bySeniority[sen] = { total: 0, responded: 0 };
      bySeniority[sen].total++;
      if (a.view_count > 0) bySeniority[sen].responded++;
    });

    return { byPlatform, bySeniority };
  }, [applications]);

  const renderBars = (data: Record<string, { total: number; responded: number }>) =>
    Object.entries(data)
      .sort((a, b) => {
        const rateA = a[1].total > 0 ? a[1].responded / a[1].total : 0;
        const rateB = b[1].total > 0 ? b[1].responded / b[1].total : 0;
        return rateB - rateA;
      })
      .map(([label, { total, responded }]) => {
        const rate = total > 0 ? Math.round((responded / total) * 100) : 0;
        return (
          <div key={label} className="flex items-center gap-3">
            <span className="w-24 text-sm text-muted-foreground truncate text-right">{label}</span>
            <div className="flex-1 bg-muted h-5 relative">
              <div
                className="h-full bg-accent/70 transition-all"
                style={{ width: `${rate}%` }}
              />
            </div>
            <span className="w-16 text-sm text-foreground font-mono">
              {rate}% <span className="text-muted-foreground text-xs">({total})</span>
            </span>
          </div>
        );
      });

  if (applications.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-foreground">Interview Insights</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm uppercase tracking-wide text-muted-foreground font-medium">
            Response Rate by Platform
          </h3>
          <div className="space-y-2">{renderBars(insights.byPlatform)}</div>
        </div>
        <div className="border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm uppercase tracking-wide text-muted-foreground font-medium">
            Response Rate by Seniority
          </h3>
          <div className="space-y-2">{renderBars(insights.bySeniority)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───
export default function Apply() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("apply-auth") === "1");
  const [applications, setApplications] = useState<Application[]>([]);
  const [visits, setVisits] = useState<PortfolioVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [appsRes, visitsRes] = await Promise.all([
      supabase.from("applications").select("*").order("date_applied", { ascending: false }),
      supabase.from("portfolio_visits").select("*").order("visited_at", { ascending: false }),
    ]);

    if (appsRes.data) setApplications(appsRes.data as unknown as Application[]);
    if (visitsRes.data) setVisits(visitsRes.data as unknown as PortfolioVisit[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
      return;
    }
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(`Status updated to ${status}`);
  };

  if (!authed) return <PasswordGate onUnlock={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-lg text-foreground">Application Tracker</h1>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-12">
        {/* Section 1: Analyser */}
        <JobAnalyser onSaved={fetchData} />

        {/* Divider */}
        <div className="editorial-rule" />

        {/* Section 2: Dashboard */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-12">
            <StatsRow applications={applications} visits={visits} />
            <ApplicationsTable applications={applications} onStatusChange={handleStatusChange} />
            <ActivityHeatmap visits={visits} />
            <InterviewInsights applications={applications} />
          </div>
        )}
      </main>
    </div>
  );
}
