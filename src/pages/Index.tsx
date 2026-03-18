import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";

import Contact from "@/components/Contact";

const Index = () => (
  <main className="bg-background text-foreground">
    <Hero />
    <About />
    <Skills />
    <Projects />
    
    <Contact />
  </main>
);

export default Index;
