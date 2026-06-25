import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { requireAdmin } from "@/lib/gating";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const state = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <Sidebar state={state} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar state={state} />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-12">{children}</main>
      </div>
    </div>
  );
}
