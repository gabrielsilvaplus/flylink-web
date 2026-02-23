import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function VerticalThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-50">
            <div className="relative flex flex-col items-center p-1 bg-secondary/50 backdrop-blur-sm border border-border rounded-full shadow-lg">
                {/* Animated Background Indicator */}
                <motion.div
                    layoutId="theme-indicator"
                    className="absolute w-8 h-8 rounded-full bg-background shadow-sm border border-border"
                    initial={false}
                    animate={{
                        top: theme === "dark" ? "calc(100% - 36px)" : "4px",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                {/* Light Mode Button */}
                <button
                    onClick={() => setTheme("light")}
                    className={cn(
                        "relative z-10 p-2 rounded-full transition-colors duration-200",
                        theme === "light" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="Light Mode"
                >
                    <Sun className="w-4 h-4" />
                </button>

                <div className="w-px h-2 bg-border/50 my-1" />

                {/* Dark Mode Button */}
                <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                        "relative z-10 p-2 rounded-full transition-colors duration-200",
                        theme === "dark" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="Dark Mode"
                >
                    <Moon className="w-4 h-4" />
                </button>
            </div>

            {/* Vertical Text Label */}
            <div className="writing-mode-vertical text-[10px] font-medium tracking-widest text-muted-foreground uppercase opacity-50 select-none">
                {theme === "dark" ? "Dark" : "Light"} Mode
            </div>

            <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
        </div>
    );
}
