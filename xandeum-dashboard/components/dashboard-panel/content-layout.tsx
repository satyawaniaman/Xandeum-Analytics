import { Navbar } from "@/components/dashboard-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <Navbar title={title} />
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}