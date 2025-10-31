"use client";
import { LayoutDashboard, Briefcase, FileText, Users, Settings } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const providerMenuItems = [
  {
    title: "Dashboard",
    href: "/provider/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "My Teams",
    href: "/provider/dashboard/teams",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Jobs",
    href: "/provider/dashboard/jobs",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    title: "Profile",
    href: "/provider/dashboard/profile",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Settings",
    href: "/provider/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function ProviderSidebar({ isOpen, onClose }) {
  return <DashboardSidebar menuItems={providerMenuItems} isOpen={isOpen} onClose={onClose} />;
}

