import { motion } from "framer-motion";

const Hero = () =>
<section className="min-h-svh flex flex-col justify-center px-6 md:px-12 relative overflow-hidden">
    {/* Background ink-style graph */}
    <svg
    className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
    viewBox="0 0 1200 800"
    preserveAspectRatio="none">
    
      <motion.path
      d="M0 600 Q 150 400 300 500 T 600 350 T 900 450 T 1200 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3, ease: "easeInOut" }}
      strokeDasharray="1000" />
    
      <motion.path
      d="M0 700 Q 200 550 400 650 T 800 400 T 1200 500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
      strokeDasharray="1000" />
    
    </svg>

    <div className="max-w-7xl mx-auto w-full z-10">
      






    

      <motion.h1
      initial={{ opacity: 0, y: -80, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 300,
        damping: 12,
      }}
      className="font-display text-6xl sm:text-7xl md:text-[10rem] lg:text-[12rem] leading-[0.85] mb-12 -ml-1">
      
        Hello, I'm <br />
        <span className="italic">William.</span>
      </motion.h1>

      <div className="grid grid-cols-12 gap-6">
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="col-span-12 md:col-span-5">
        
          <p className="font-sans text-lg md:text-xl leading-relaxed text-foreground/70">
            An aspiring data analyst translating complex datasets into sharp,
            actionable narratives for the modern web.
          </p>
          <a
          href="#projects"
          className="mt-10 group inline-flex items-center gap-4 border border-foreground px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-foreground hover:text-background transition-colors duration-300">
          
            View My Work
            <span className="group-hover:translate-x-2 transition-transform duration-300">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </div>
  </section>;


export default Hero;