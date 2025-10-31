"use client";
import { useSelector } from "react-redux";
import CraftworkerDashboardLayout from "@/components/craftworker/CraftworkerDashboardLayout";

export default function CraftworkerDashboard() {
  const { user, profile } = useSelector((state) => state.auth);

  return (
    <CraftworkerDashboardLayout>
      <h1 className="text-4xl font-bold text-card-foreground mb-4">
        Dashboard
      </h1>
      {user && (
        <p className="text-muted-foreground mb-8">
          Welcome back, {profile?.fullName || user.email}
        </p>
      )}
      
      {/* Dashboard content will be added in next steps */}
    </CraftworkerDashboardLayout>
  );
}

