import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
      className="p-2 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors duration-300"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default DarkModeToggle;
