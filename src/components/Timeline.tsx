import ScrollReveal from "./ScrollReveal";

const timelineEntries = [
  {
    role: "Data Analyst Intern",
    company: "Meridian Analytics",
    dates: "Jun 2024 — Present",
    points: [
      "Architected an automated ETL pipeline processing 1.2M daily records, reducing manual reporting time by 41.2%.",
      "Built interactive Tableau dashboards for C-suite stakeholders across 3 business units.",
      "Implemented anomaly detection models that flagged $340K in billing discrepancies.",
    ],
  },
  {
    role: "Research Assistant — Data Science Lab",
    company: "University of Melbourne",
    dates: "Feb 2023 — May 2024",
    points: [
      "Conducted NLP sentiment analysis on 50K+ survey responses for a public health study.",
      "Co-authored research paper on predictive modelling for student retention (accepted at AIED 2024).",
    ],
  },
  {
    role: "Freelance Data Consultant",
    company: "Self-employed",
    dates: "Jan 2022 — Jan 2023",
    points: [
      "Delivered 8 end-to-end analytics projects for small businesses across retail, hospitality, and education.",
      "Designed custom Google Sheets dashboards with Apps Script automation for non-technical clients.",
      "Achieved 100% client satisfaction rate across all engagements.",
    ],
  },
];

const Timeline = () => (
  <section className="py-24 md:py-32 px-6 md:px-12 editorial-rule">
    <div className="max-w-7xl mx-auto">
      <ScrollReveal>
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion mb-16 underline underline-offset-8 decoration-vermillion/40">
          Experience
        </h2>
      </ScrollReveal>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 md:left-[16.666%] top-0 bottom-0 w-[1px] bg-foreground/10" />

        <div className="space-y-16 md:space-y-20">
          {timelineEntries.map((entry, i) => (
            <ScrollReveal key={entry.role} delay={i * 0.1}>
              <div className="grid grid-cols-12 gap-6 md:gap-8 relative">
                {/* Dot marker */}
                <div
                  className="absolute left-0 md:left-[16.666%] top-2 w-2.5 h-2.5 bg-vermillion -translate-x-1/2"
                  style={{ clipPath: "none" }}
                />

                {/* Dates */}
                <div className="col-span-12 md:col-span-2 pl-6 md:pl-0 md:text-right md:pr-8">
                  <span className="font-mono text-xs text-muted-foreground">
                    {entry.dates}
                  </span>
                </div>

                {/* Content */}
                <div className="col-span-12 md:col-span-8 md:col-start-3 pl-6 md:pl-12">
                  <h3 className="font-display text-2xl md:text-3xl mb-1">
                    {entry.role}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground uppercase tracking-widest mb-4">
                    {entry.company}
                  </p>
                  <ul className="space-y-2">
                    {entry.points.map((point, pi) => (
                      <li
                        key={pi}
                        className="font-sans text-base text-foreground/75 leading-relaxed pl-4 border-l border-foreground/10"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Timeline;
