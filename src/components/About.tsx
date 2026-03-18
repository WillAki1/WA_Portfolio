import ScrollReveal from "./ScrollReveal";

const About = () => (
  <section className="py-24 md:py-32 px-6 md:px-12 editorial-rule">
    <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 md:gap-16">
      <ScrollReveal className="col-span-12 md:col-span-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion mb-8">
          About
        </p>
        <blockquote className="font-display text-3xl md:text-5xl leading-[1.1] italic">
          "I don't just clean data&nbsp;— I find the stories hiding inside it."
        </blockquote>
      </ScrollReveal>

      <ScrollReveal className="col-span-12 md:col-span-7 space-y-6" delay={0.15}>
        <p className="font-sans text-lg leading-relaxed text-foreground/80">
          I'm William — a data analyst who believes every dataset has a narrative
          waiting to be uncovered. My work sits at the intersection of rigorous
          statistical analysis and compelling visual storytelling.
        </p>
        <p className="font-sans text-lg leading-relaxed text-foreground/80">
          With a foundation in Python, R, and SQL, I build end-to-end analytical
          pipelines that transform raw, messy data into clear, decision-driving
          insights. I've reduced reporting turnaround by 41.2% and increased
          forecast accuracy by 18.7% across multiple projects.
        </p>
        <p className="font-sans text-lg leading-relaxed text-foreground/80">
          I approach every problem with intellectual curiosity and a bias toward
          clarity. Whether it's a 500K-row retail dataset or a real-time sensor
          feed, I find the signal in the noise and present it with precision.
        </p>
        <p className="font-sans text-lg leading-relaxed text-foreground/80">
          When I'm not wrangling data, I'm exploring generative art with D3.js
          or reading about the history of information design — from Florence
          Nightingale's rose diagrams to Edward Tufte's visual explanations.
        </p>
      </ScrollReveal>
    </div>
  </section>
);

export default About;
