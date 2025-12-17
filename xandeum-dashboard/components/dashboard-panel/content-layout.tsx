import { Navbar } from "@/components/dashboard-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  onExport?: (format: "json" | "csv") => void;
  networkStatus?: "online" | "offline" | "degraded" | "maintenance";
}

export function ContentLayout({ title, children, onRefresh, onExport, networkStatus }: ContentLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <Navbar title={title} onRefresh={onRefresh} onExport={onExport} networkStatus={networkStatus} />
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}