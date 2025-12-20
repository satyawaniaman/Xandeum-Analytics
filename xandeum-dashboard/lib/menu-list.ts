import { HomeIcon } from "@/components/ui/home";
import { MonitorCheckIcon } from "@/components/ui/monitor-check";
import { ChartLineIcon } from "@/components/ui/chart-line";
import { SettingsIcon } from "@/components/ui/settings";
import { ArrowLeftRightIcon } from "@/components/ui/arrow-left-right";
import { ComponentType } from "react";
import { BookOpenIcon } from "@/components/ui/book-open";

type Submenu = {
    href: string;
    label: string;
    active?: boolean;
};

// Icon component type for lucide-animated
export type MenuIconComponent = ComponentType<{ size?: number; className?: string }>;

type Menu = {
    href: string;
    label: string;
    active?: boolean;
    icon: MenuIconComponent;
    submenus?: Submenu[];
};

type Group = {
    groupLabel: string;
    menus: Menu[];
};

export function getMenuList(_pathname: string): Group[] {
    return [
        {
            groupLabel: "",
            menus: [
                {
                    href: "/dashboard",
                    label: "Overview",
                    icon: HomeIcon,
                    submenus: []
                }
            ]
        },
        {
            groupLabel: "pNodes",
            menus: [
                {
                    href: "/dashboard/network",
                    label: "Network",
                    icon: ChartLineIcon
                },
                {
                    href: "/dashboard/nodes",
                    label: "Nodes",
                    icon: MonitorCheckIcon
                }
            ]
        },
        {
            groupLabel: "Trading",
            menus: [
                {
                    href: "/dashboard/trade",
                    label: "Trade XAND",
                    icon: ArrowLeftRightIcon
                }
            ]
        },
        {
            groupLabel: "Resources",
            menus: [
                {
                    href: "/docs",
                    label: "Documentation",
                    icon: BookOpenIcon,
                    submenus: [
                        {
                            href: "/docs",
                            label: "Introduction",
                            active: _pathname === "/docs"
                        },
                        {
                            href: "/docs/platform/architecture",
                            label: "Platform Architecture",
                            active: _pathname === "/docs/platform/architecture"
                        },
                        {
                            href: "/docs/platform/backend",
                            label: "Backend API",
                            active: _pathname === "/docs/platform/backend"
                        },
                        {
                            href: "/docs/platform/frontend",
                            label: "Dashboard Features",
                            active: _pathname === "/docs/platform/frontend"
                        },
                        {
                            href: "/docs/features/xandbot",
                            label: "Xandbot AI",
                            active: _pathname === "/docs/features/xandbot"
                        },
                        {
                            href: "/docs/features/pod-credits",
                            label: "Pod Credits",
                            active: _pathname === "/docs/features/pod-credits"
                        },
                        {
                            href: "/docs/features/swaps",
                            label: "Token Swaps",
                            active: _pathname === "/docs/features/swaps"
                        }
                    ]
                }
            ]
        },
        {
            groupLabel: "Settings",
            menus: [
                {
                    href: "/dashboard/settings",
                    label: "Settings",
                    icon: SettingsIcon
                }
            ]
        }
    ];
}