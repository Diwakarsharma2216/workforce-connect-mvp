"use client";
import { useSelector } from "react-redux";
import ProviderDashboardLayout from "@/components/provider/ProviderDashboardLayout";

export default function ProviderDashboard() {
  const { user, profile } = useSelector((state) => state.auth);

  return (
    <ProviderDashboardLayout>
      <h1 className="text-4xl font-bold text-card-foreground mb-4">
        Dashboard
      </h1>
      {user && (
        <p className="text-muted-foreground mb-8">
          Welcome back, {profile?.companyName || user.email}
        </p>
      )}
      
      {/* Dashboard content will be added in next steps */}
    </ProviderDashboardLayout>
  );
}

