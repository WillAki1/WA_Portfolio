import ScrollReveal from "./ScrollReveal";

const Contact = () => (
  <section className="py-24 md:py-32 px-6 md:px-12 editorial-rule">
    <div className="max-w-7xl mx-auto">
      <ScrollReveal>
        <h2 className="font-display text-4xl md:text-7xl lg:text-8xl leading-[0.9] mb-12 max-w-4xl">
          Let's Turn Data Into Decisions{" "}
          <span className="italic text-vermillion">Together.</span>
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <a
          href="mailto:william@example.com"
          className="font-sans text-xl md:text-3xl link-underline text-foreground/80 hover:text-foreground transition-colors duration-300"
        >
          william@example.com
        </a>

        <div className="flex gap-8 mt-10">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest link-underline pb-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-widest link-underline pb-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <div className="mt-24 pt-8 border-t border-foreground/10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} William Porter. Designed with editorial precision.
          </p>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default Contact;
