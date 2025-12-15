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

    return (
        <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <Button
                        className="rounded-full w-8 h-8 bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
                </TooltipTrigger>
                <TooltipContent side="bottom">Switch Theme</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}