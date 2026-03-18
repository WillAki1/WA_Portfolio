import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import ScrollReveal from "./ScrollReveal";
import { useState, useEffect, useRef } from "react";

const lineData = [
  { name: "Jan", value: 4200 }, { name: "Feb", value: 3800 },
  { name: "Mar", value: 5100 }, { name: "Apr", value: 4600 },
  { name: "May", value: 5800 }, { name: "Jun", value: 7200 },
  { name: "Jul", value: 6900 }, { name: "Aug", value: 8100 },
  { name: "Sep", value: 7600 }, { name: "Oct", value: 9200 },
  { name: "Nov", value: 8800 }, { name: "Dec", value: 10400 },
];

const barData = [
  { name: "Electronics", revenue: 42000, cost: 28000 },
  { name: "Clothing", revenue: 35000, cost: 18000 },
  { name: "Food", revenue: 28000, cost: 22000 },
  { name: "Books", revenue: 18000, cost: 8000 },
  { name: "Sports", revenue: 24000, cost: 15000 },
  { name: "Home", revenue: 31000, cost: 19000 },
];

const scatterData = Array.from({ length: 40 }, (_, i) => ({
  x: Math.round(20 + Math.random() * 80),
  y: Math.round(10 + Math.random() * 90),
}));

const areaData = [
  { name: "W1", users: 1200, sessions: 3400 },
  { name: "W2", users: 1800, sessions: 4200 },
  { name: "W3", users: 2200, sessions: 5100 },
  { name: "W4", users: 2800, sessions: 6800 },
  { name: "W5", users: 3200, sessions: 7200 },
  { name: "W6", users: 3800, sessions: 8400 },
  { name: "W7", users: 4100, sessions: 9100 },
  { name: "W8", users: 4600, sessions: 10200 },
];

const tooltipStyle = {
  borderRadius: "0px",
  border: "1px solid #111010",
  fontFamily: "Epilogue",
  fontSize: "12px",
};

const axisTickStyle = { fill: "#8C8C8C", fontSize: 10, fontFamily: "JetBrains Mono" };

interface ProjectData {
  title: string;
  summary: string;
  tags: string[];
  chart: React.ReactNode;
}

const ChartWrapper = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full aspect-video">
      {visible ? children : <div className="w-full h-full" />}
    </div>
  );
};

const projects: ProjectData[] = [
  {
    title: "Retail Sales Forecasting",
    summary: "Time-series forecasting model trained on 500K+ rows of retail transaction data, reducing inventory waste by 23.4%.",
    tags: ["Python", "Scikit-learn", "Pandas", "SQL"],
    chart: (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTickStyle} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#E63323", strokeWidth: 1 }} />
            <Line type="monotone" dataKey="value" stroke="#E63323" strokeWidth={3} dot={false} animationDuration={2000} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    ),
  },
  {
    title: "E-Commerce Revenue Analysis",
    summary: "Comparative revenue vs. cost analysis across 6 product categories revealing a 31% margin gap in Food & Beverage.",
    tags: ["PYTHON", "Tableau", "PostgreSQL"],
    chart: (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTickStyle} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="revenue" fill="#111010" animationDuration={1500} />
            <Bar dataKey="cost" fill="#E63323" opacity={0.7} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    ),
  },
  {
    title: "Customer Segmentation",
    summary: "K-means clustering on 12,000 customer profiles identifying 4 distinct behavioral segments with 89.3% silhouette score.",
    tags: ["Python", "Scikit-learn", "NLP", "D3.js"],
    chart: (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#11101010" />
            <XAxis dataKey="x" axisLine={false} tickLine={false} tick={axisTickStyle} name="Spend" />
            <YAxis dataKey="y" axisLine={false} tickLine={false} tick={axisTickStyle} name="Frequency" />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={scatterData} fill="#E63323" animationDuration={2000} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartWrapper>
    ),
  },
  {
    title: "User Growth Analytics",
    summary: "Real-time dashboard tracking weekly active users and session depth, surfacing a 283% growth trajectory over 8 weeks.",
    tags: ["Power BI", "SQL", "Excel"],
    chart: (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTickStyle} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="sessions" stroke="#11101030" fill="#11101008" strokeWidth={1.5} animationDuration={2000} />
            <Area type="monotone" dataKey="users" stroke="#E63323" fill="#E6332310" strokeWidth={2.5} animationDuration={2000} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    ),
  },
];

const Projects = () => (
  <section id="projects" className="py-24 md:py-32 px-6 md:px-12 editorial-rule">
    <div className="max-w-7xl mx-auto">
      <ScrollReveal>
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion mb-16 underline underline-offset-8 decoration-vermillion/40">
          Selected Work
        </h2>
      </ScrollReveal>

      {projects.map((project, i) => (
        <ScrollReveal key={project.title} delay={0.1}>
          <div className="py-16 md:py-24 border-t border-foreground/10 grid grid-cols-12 gap-8 items-start">
            {/* Metadata */}
            <div className="col-span-12 md:col-span-4 md:sticky md:top-24">
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] uppercase tracking-tight border border-foreground/20 px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-display text-3xl md:text-5xl mb-6 leading-tight">
                {project.title}
              </h3>
              <p className="font-sans text-base md:text-lg text-foreground/70 mb-8">
                {project.summary}
              </p>
              <a
                href="#"
                className="group inline-flex items-center font-sans font-bold text-sm uppercase tracking-widest"
              >
                Read Case Study
                <div className="ml-2 h-[1px] w-8 bg-vermillion group-hover:w-12 transition-all duration-300" />
              </a>
            </div>

            {/* Chart */}
            <div className="col-span-12 md:col-span-8 border border-foreground/5 p-6 md:p-12">
              {project.chart}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </section>
);

export default Projects;
