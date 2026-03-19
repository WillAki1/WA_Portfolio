import ScrollReveal from "./ScrollReveal";

const skillGroups = [
{ label: "Languages", items: ["Python", "SQL"] },
{ label: "Visualisation", items: ["Tableau", "Power BI"] },
{ label: "Spreadsheets", items: ["Excel", "Google Sheets"] },
{
  label: "AI / Machine Learning",
  items: ["Scikit-learn", "NLP"]
}];


const Skills = () =>
<section className="py-24 md:py-32 px-6 md:px-12 editorial-rule">
    <div className="max-w-7xl mx-auto">
      <ScrollReveal>
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion mb-16 underline underline-offset-8 decoration-vermillion/40">TECHNICAL SKILLS

      </h2>
      </ScrollReveal>

      <div className="space-y-16 md:space-y-24">
        {skillGroups.map((group, gi) =>
      <ScrollReveal key={group.label} delay={gi * 0.1}>
            <div className="grid grid-cols-12 border-b border-foreground/10 pb-10 md:pb-12">
              <div className="col-span-12 md:col-span-3 mb-4 md:mb-0">
                <span className="font-sans font-bold uppercase text-xs tracking-widest">
                  {group.label}
                </span>
              </div>
              <div className="col-span-12 md:col-span-9 flex flex-wrap gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6">
                {group.items.map((item, i) =>
            <span
              key={item}
              className={`font-display text-3xl md:text-5xl lg:text-6xl transition-colors duration-300 hover:text-vermillion cursor-default ${
              i % 2 === 0 ?
              "font-normal" :
              "italic font-light opacity-60"}`
              }>
              
                    {item}
                  </span>
            )}
              </div>
            </div>
          </ScrollReveal>
      )}
      </div>
    </div>
  </section>;


export default Skills;