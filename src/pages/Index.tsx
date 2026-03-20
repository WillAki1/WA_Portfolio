import { useEffect } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useEffect(() => {
    supabase.functions.invoke("notify-visitor", {
      body: {
        page: window.location.pathname,
        referrer: document.referrer ? new URL(document.referrer).origin : null,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
    }).catch(() => {});
  }, []);

  return (
    <main className="bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
};

export default Index;
