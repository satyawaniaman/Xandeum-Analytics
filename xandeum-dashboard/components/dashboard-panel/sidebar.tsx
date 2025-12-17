"use client";
import { Menu } from "@/components/dashboard-panel/menu";
import { SidebarToggle } from "@/components/dashboard-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
    const sidebar = useStore(useSidebar, (x) => x);
    if (!sidebar) return null;
    const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
    return (
        <aside
            className={cn(
                "fixed top-14 left-0 z-20 h-[calc(100vh-3.5rem)] -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-sidebar border-r border-border",
                !getOpenState() ? "w-[90px]" : "w-64",
                settings.disabled && "hidden"
            )}
        >
            <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className="relative h-full flex flex-col px-3 py-4 overflow-hidden"
            >
                <Button
                    className={cn(
                        "transition-transform ease-in-out duration-300 mb-1",
                        !getOpenState() ? "translate-x-1" : "translate-x-0"
                    )}
                    variant="link"
                    asChild
                >
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Image
                            src="https://images.archbee.com/ePevXmvzgG-7aqJ72Gpg_/syZjHGO-CjsEK5FAwqEeW_ljxyedtmkpohjqlo5qwmi-xandeumlogom1.png"
                            alt="Xandeum Analytics"
                            width={28}
                            height={28}
                        />
                        <h1
                            className={cn(
                                "font-semibold text-base whitespace-nowrap text-foreground transition-[transform,opacity,display] ease-in-out duration-300",
                                !getOpenState()
                                    ? "-translate-x-96 opacity-0 hidden"
                                    : "translate-x-0 opacity-100"
                            )}
                        >
                            Xandeum Analytics
                        </h1>
                    </Link>
                </Button>
                <Menu isOpen={getOpenState()} />
            </div>
        </aside>
    );
}