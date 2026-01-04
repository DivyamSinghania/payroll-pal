import { Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/payroll";

interface RoleToggleProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleToggle({ selectedRole, onRoleChange }: RoleToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onRoleChange('admin')}
        className={cn(
          "role-toggle",
          selectedRole === 'admin' && "role-toggle-active"
        )}
      >
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          selectedRole === 'admin' 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          <Shield className="h-5 w-5" />
        </div>
        <div className="text-left">
          <p className="font-medium text-foreground">Admin</p>
          <p className="text-xs text-muted-foreground">Manage payroll</p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onRoleChange('employee')}
        className={cn(
          "role-toggle",
          selectedRole === 'employee' && "role-toggle-active"
        )}
      >
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
          selectedRole === 'employee' 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          <User className="h-5 w-5" />
        </div>
        <div className="text-left">
          <p className="font-medium text-foreground">Employee</p>
          <p className="text-xs text-muted-foreground">View salary</p>
        </div>
      </button>
    </div>
  );
}
