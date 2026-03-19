import ScrollReveal from "./ScrollReveal";

const About = () =>
<section className="py-24 md:py-32 px-6 md:px-12 editorial-rule">
    <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 md:gap-16">
      <ScrollReveal className="col-span-12 md:col-span-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion mb-8">ABOUT ME

      </p>
        <blockquote className="font-display text-3xl md:text-5xl leading-[1.1] italic">
          "I don't just clean data&nbsp;— I find the stories hiding inside it."
        </blockquote>
      </ScrollReveal>

      <ScrollReveal className="col-span-12 md:col-span-7 space-y-6" delay={0.15}>
        <p className="font-sans text-lg leading-relaxed text-foreground/80">As an aspiring data analyst, I believe every dataset has a narrative waiting to be uncovered. My work sits at the intersection of rigorous statistical analysis and compelling visual storytelling.



      </p>
        <p className="font-sans text-lg leading-relaxed text-foreground/80">
          With a foundation in Python and SQL, I build end-to-end analytical
          pipelines that transform raw, messy data into clear, decision-driving
          insights. I approach every problem with curiosity and a bias towards
          clarity, to present with precision.
        </p>
        <p className="font-sans text-lg leading-relaxed text-foreground/80">When I'm not wrangling data, I love to stay active by playing football (yes, I support the greatest club in the world... Chelsea), going for runs and trying to get it under sub 20, and playing a nice backhand serve in padel that can't be returned!



      </p>
      </ScrollReveal>
    </div>
  </section>;


export default About;