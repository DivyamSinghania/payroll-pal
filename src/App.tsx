import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSalarySlips from "./pages/admin/AdminSalarySlips";
import AdminEmployees from "./pages/admin/AdminEmployees";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeSalarySlips from "./pages/employee/EmployeeSalarySlips";
import EmployeeExpenses from "./pages/employee/EmployeeExpenses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout role="admin" />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="salary-slips" element={<AdminSalarySlips />} />
              <Route path="employees" element={<AdminEmployees />} />
            </Route>
            
            {/* Employee Routes */}
            <Route 
              path="/employee" 
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <DashboardLayout role="employee" />
                </ProtectedRoute>
              }
            >
              <Route index element={<EmployeeDashboard />} />
              <Route path="salary-slips" element={<EmployeeSalarySlips />} />
              <Route path="expenses" element={<EmployeeExpenses />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
