"use client";
import CompanyDashboardLayout from "@/components/company/CompanyDashboardLayout";

export default function CompanySettings() {
  return (
    <CompanyDashboardLayout>
      <h1 className="text-4xl font-bold text-card-foreground mb-4">
        Settings
      </h1>
      <p className="text-muted-foreground mb-8">
        Manage your account settings here
      </p>
      
      {/* Settings content will be added in next steps */}
    </CompanyDashboardLayout>
  );
}

