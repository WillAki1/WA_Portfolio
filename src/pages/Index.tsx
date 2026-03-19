import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import DarkModeToggle from "@/components/DarkModeToggle";

const Index = () => (
  <main className="bg-background text-foreground transition-colors duration-300">
    <DarkModeToggle />
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Contact />
  </main>
);

export default Index;
