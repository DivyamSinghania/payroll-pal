import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import type { UserRole } from "@/types/payroll";

interface DashboardLayoutProps {
  role: UserRole;
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar role={role} />
      <div className="ml-64">
        <DashboardHeader role={role} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
