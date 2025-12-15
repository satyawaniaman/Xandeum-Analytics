"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SheetMenu } from "@/components/dashboard-panel/sheet-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCWIcon, type RotateCWIconHandle } from "@/components/ui/rotate-cw";
import { SearchIcon } from "@/components/ui/search";
import { DownloadIcon } from "@/components/ui/download";
import { Status, StatusIndicator, StatusLabel } from "@/components/kibo-ui/status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  title: string;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  onExport?: (format: "json" | "csv") => void;
  networkStatus?: "online" | "offline" | "degraded" | "maintenance";
}

export function Navbar({ title, onRefresh, onSearch, onExport, networkStatus = "online" }: NavbarProps) {
  const [countdown, setCountdown] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const iconRef = useRef<RotateCWIconHandle>(null);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCountdown(30);
    iconRef.current?.startAnimation();
    onRefresh?.();
    setTimeout(() => {
      setIsRefreshing(false);
      iconRef.current?.stopAnimation();
    }, 500);
  }, [onRefresh]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleExport = (format: "json" | "csv") => {
    onExport?.(format);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleRefresh]);

  return (
    <header className="sticky top-0 z-10 w-full border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
      <div className="px-6 flex h-14 items-center justify-between gap-4">
        <div className="flex items-center space-x-4 lg:space-x-3">
          <SheetMenu />
          <Status status={networkStatus}>
            <StatusIndicator />
            <StatusLabel />
          </Status>
          <div className="h-4 w-px bg-zinc-700 hidden lg:block" />
          <h1 className="text-lg font-semibold text-zinc-100">{title}</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 gap-2"
              >
                <DownloadIcon size={16} />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 min-w-[120px] ">
              <DropdownMenuItem
                onClick={() => handleExport("json")}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer justify-center"
              >
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport("csv")}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer justify-center"
              >
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auto Refresh */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-800/50">
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm">
              <span className="text-zinc-500 hidden sm:inline">Next refresh</span>
              <span className="font-mono font-medium text-zinc-200 tabular-nums">{countdown}s</span>
            </div>
            <div className="h-6 w-px bg-zinc-700" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 rounded-l-none"
            >
              <RotateCWIcon ref={iconRef} size={16} />
            </Button>
          </div>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}