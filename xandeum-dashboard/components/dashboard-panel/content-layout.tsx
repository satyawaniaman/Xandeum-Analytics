import { Navbar } from "@/components/dashboard-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  networkStatus?: "online" | "offline" | "degraded" | "maintenance";
}

export function ContentLayout({ title, children, onRefresh, networkStatus }: ContentLayoutProps) {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <Navbar title={title} onRefresh={onRefresh} networkStatus={networkStatus} />
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}