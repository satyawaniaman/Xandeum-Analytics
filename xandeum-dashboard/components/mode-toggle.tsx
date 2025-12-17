"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon } from "@/components/ui/sun";
import { MoonIcon } from "@/components/ui/moon";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();
    const [isXandeumTheme, setIsXandeumTheme] = React.useState(false);

    React.useEffect(() => {
        // Check initial state
        const checkTheme = () => {
            const isXandeum = document.documentElement.classList.contains("theme-xandeum") ||
                localStorage.getItem("xandeum-theme-preference") === "xandeum";
            setIsXandeumTheme(isXandeum);
        };

        checkTheme();

        // Listen for updates
        const handleThemeChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            setIsXandeumTheme(customEvent.detail.active);
        };

        window.addEventListener("xandeum-theme-change", handleThemeChange);
        return () => window.removeEventListener("xandeum-theme-change", handleThemeChange);
    }, []);

    const isDisabled = isXandeumTheme;

    return (
        <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <div className="inline-block">
                        <Button
                            className="rounded-full w-8 h-8 bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50"
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            disabled={isDisabled}
                        >
                            <SunIcon
                                size={16}
                                className="rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100"
                            />
                            <MoonIcon
                                size={16}
                                className="absolute rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0"
                            />
                            <span className="sr-only">Switch Theme</span>
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {isDisabled ? "Mode locked in Xandeum Theme" : "Switch Theme"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}