import { HomeIcon } from "@/components/ui/home";
import { MonitorCheckIcon } from "@/components/ui/monitor-check";
import { ChartLineIcon } from "@/components/ui/chart-line";
import { SettingsIcon } from "@/components/ui/settings";
import { ComponentType } from "react";

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

export function getMenuList(pathname: string): Group[] {
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
                    href: "/dashboard/nodes",
                    label: "All Nodes",
                    icon: MonitorCheckIcon
                },
                {
                    href: "/dashboard/analytics",
                    label: "Analytics",
                    icon: ChartLineIcon
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