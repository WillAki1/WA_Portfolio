import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from
"recharts";
import ScrollReveal from "./ScrollReveal";
import TiltCard from "./TiltCard";
import { useState, useEffect, useRef } from "react";

// Customer Churn data
const churnData = [
{ name: "Month 1", retained: 95, churned: 5 },
{ name: "Month 2", retained: 89, churned: 11 },
{ name: "Month 3", retained: 82, churned: 18 },
{ name: "Month 4", retained: 78, churned: 22 },
{ name: "Month 5", retained: 74, churned: 26 },
{ name: "Month 6", retained: 71, churned: 29 },
{ name: "Month 7", retained: 68, churned: 32 },
{ name: "Month 8", retained: 65, churned: 35 }];


// E-Commerce Sales data
const salesData = [
{ name: "Electronics", revenue: 42000, cost: 28000 },
{ name: "Clothing", revenue: 35000, cost: 18000 },
{ name: "Food", revenue: 28000, cost: 22000 },
{ name: "Books", revenue: 18000, cost: 8000 },
{ name: "Sports", revenue: 24000, cost: 15000 },
{ name: "Home", revenue: 31000, cost: 19000 }];


// World Cup prediction data
const predictionData = Array.from({ length: 30 }, (_, i) => ({
  x: Math.round(20 + Math.random() * 80),
  y: Math.round(10 + Math.random() * 90)
}));

const tooltipStyle = {
  borderRadius: "0px",
  border: "1px solid #111010",
  fontFamily: "Epilogue",
  fontSize: "12px"
};

const axisTickStyle = { fill: "#8C8C8C", fontSize: 10, fontFamily: "JetBrains Mono" };

interface ProjectData {
  title: string;
  summary: string;
  tags: string[];
  chart: React.ReactNode;
}

const ChartWrapper = ({ children }: {children: React.ReactNode;}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setVisible(true);},
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full aspect-video">
      {visible ? children : <div className="w-full h-full" />}
    </div>);

};

const projects: ProjectData[] = [
{
  title: "Customer Churn Analysis",
  summary: "Predictive churn model analysing customer behaviour patterns across 8 months, identifying key retention drivers and reducing churn rate by 18%.",
  tags: ["Python", "Scikit-learn", "Pandas", "SQL"],
  chart:
  <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={churnData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTickStyle} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#E63323", strokeWidth: 1 }} />
            <Line type="monotone" dataKey="retained" stroke="#111010" strokeWidth={2.5} dot={false} animationDuration={2000} />
            <Line type="monotone" dataKey="churned" stroke="#E63323" strokeWidth={2.5} dot={false} animationDuration={2000} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

},
{
  title: "E-Commerce Sales Performance Analysis",
  summary: "Comprehensive revenue vs. cost analysis across 6 product categories, uncovering margin inefficiencies and driving data-backed pricing strategy.",
  tags: ["Python", "Tableau", "PostgreSQL", "Excel"],
  chart:
  <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTickStyle} />
            <YAxis hide />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="revenue" fill="#111010" animationDuration={1500} />
            <Bar dataKey="cost" fill="#E63323" opacity={0.7} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

},
{
  title: "Sports Analytics: World Cup 2026 Winner Prediction",
  summary: "Machine learning model leveraging historical match data, team rankings, and player statistics to predict the 2026 FIFA World Cup outcome.",
  tags: ["Python", "Scikit-learn", "NLP", "Power BI"],
  chart:
  <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#11101010" />
            <XAxis dataKey="x" axisLine={false} tickLine={false} tick={axisTickStyle} name="Team Strength" />
            <YAxis dataKey="y" axisLine={false} tickLine={false} tick={axisTickStyle} name="Win Probability" />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={predictionData} fill="#E63323" animationDuration={2000} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartWrapper>

}];


const Projects = () =>
<section id="projects" className="py-24 md:py-32 px-6 md:px-12 editorial-rule">
    <div className="max-w-7xl mx-auto">
      <ScrollReveal>
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion mb-4 underline underline-offset-8 decoration-vermillion/40">
          PROJECTS
        </h2>
        <p className="font-sans text-lg text-foreground/60 mb-16">
          A selection of projects I'm currently exploring.
        </p>
      </ScrollReveal>

      {projects.map((project) =>
    <ScrollReveal key={project.title} delay={0.1}>
          <TiltCard className="py-16 md:py-24 border-t border-foreground/10 border border-foreground/5 bg-card shadow-sm">
            <div className="grid grid-cols-12 gap-8 items-start p-6 md:p-10">
              <div className="col-span-12 md:col-span-4">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) =>
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-tight border border-foreground/20 px-2 py-0.5">
                
                      {tag}
                    </span>
              )}
                </div>
                <h3 className="font-display text-3xl md:text-5xl mb-6 leading-tight">
                  {project.title}
                </h3>
                <p className="font-sans text-base md:text-lg text-foreground/70 mb-8">
                  {project.summary}
                </p>
                





            
              </div>
              <div className="col-span-12 md:col-span-8 border border-foreground/5 p-6 md:p-12">
                {project.chart}
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>
    )}
    </div>
  </section>;


export default Projects;