"use client";
import { useSelector } from "react-redux";

export default function CompanyDashboard() {
  const { user, profile } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Company Dashboard
        </h1>
        {user && (
          <p className="text-gray-600">
            Welcome, {profile?.companyName || user.email}
          </p>
        )}
      </div>
    </div>
  );
}

