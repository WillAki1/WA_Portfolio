import ScrollReveal from "./ScrollReveal";
import { useState } from "react";
import { Linkedin, Github } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:william.akitikori@outlook.com?subject=${subject}&body=${body}`;
    setTimeout(() => setSending(false), 1000);
  };

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 editorial-rule">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="font-display text-4xl md:text-7xl lg:text-8xl leading-[0.9] mb-12 max-w-4xl">
            Let's Turn Data Into Decisions{" "}
            <span className="italic text-vermillion">Together.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <form onSubmit={handleSubmit} className="max-w-xl space-y-6 mb-16">
            <div>
              <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/20 py-3 font-sans text-base text-foreground focus:outline-none focus:border-vermillion transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={255}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/20 py-3 font-sans text-base text-foreground focus:outline-none focus:border-vermillion transition-colors"
                placeholder="Your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                maxLength={1000}
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b border-foreground/20 py-3 font-sans text-base text-foreground focus:outline-none focus:border-vermillion transition-colors resize-none"
                placeholder="Your message"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="group inline-flex items-center font-sans font-bold text-sm uppercase tracking-widest bg-foreground text-background px-8 py-4 hover:bg-vermillion transition-colors duration-300 disabled:opacity-50"
            >
              {sending ? "Opening Mail…" : "Send Message"}
              <div className="ml-3 h-[1px] w-6 bg-background group-hover:w-10 transition-all duration-300" />
            </button>
          </form>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <a
            href="mailto:william.akitikori@outlook.com"
            className="font-sans text-xl md:text-3xl link-underline text-foreground/80 hover:text-foreground transition-colors duration-300"
          >
            william.akitikori@outlook.com
          </a>

          <div className="flex gap-12 mt-10">
            <div className="flex flex-col items-start gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                LinkedIn
              </span>
              <a
                href="https://www.linkedin.com/in/wakitikori/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-vermillion transition-colors duration-300"
              >
                <Linkedin size={28} />
              </a>
            </div>
            <div className="flex flex-col items-start gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                GitHub
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-vermillion transition-colors duration-300"
              >
                <Github size={28} />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-24 pt-8 border-t border-foreground/10" />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Contact;
