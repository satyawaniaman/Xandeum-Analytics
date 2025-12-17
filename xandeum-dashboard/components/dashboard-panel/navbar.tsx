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
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="px-6 flex h-14 items-center justify-between gap-4">
        <div className="flex items-center space-x-4 lg:space-x-3">
          <SheetMenu />
          <Status status={networkStatus}>
            <StatusIndicator />
            <StatusLabel />
          </Status>
          <div className="h-4 w-px bg-border hidden lg:block" />
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-ring h-9"
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
                className="h-8 text-muted-foreground hover:text-foreground hover:bg-accent gap-2"
              >
                <DownloadIcon size={16} />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border min-w-[120px] ">
              <DropdownMenuItem
                onClick={() => handleExport("json")}
                className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer justify-center"
              >
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport("csv")}
                className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer justify-center"
              >
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auto Refresh */}
          <div className="flex items-center rounded-lg border border-border bg-muted">
            <div className="flex items-center gap-2 px-3 py-1.5 text-sm">
              <span className="text-muted-foreground hidden sm:inline">Next refresh</span>
              <span className="font-mono font-medium text-foreground tabular-nums min-w-[2.5ch] text-right">{countdown}s</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-l-none"
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