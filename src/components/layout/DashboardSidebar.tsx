import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Receipt, 
  LogOut,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/payroll";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DashboardSidebarProps {
  role: UserRole;
}

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/salary-slips', label: 'Salary Slips', icon: FileText },
  { to: '/admin/employees', label: 'Employees', icon: Users },
];

const employeeLinks = [
  { to: '/employee', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/salary-slips', label: 'Salary Slips', icon: FileText },
  { to: '/employee/expenses', label: 'Expenses', icon: Receipt },
];

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const links = role === 'admin' ? adminLinks : employeeLinks;

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/auth');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">PayrollPro</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/employee'}
              className={({ isActive }) =>
                cn("sidebar-item", isActive && "sidebar-item-active")
              }
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
