"use client";
import { LayoutDashboard, Briefcase, FileText, Settings, Bookmark } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const craftworkerMenuItems = [
  {
    title: "Dashboard",
    href: "/craftworker/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Available Jobs",
    href: "/craftworker/dashboard/jobs",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    title: "My Applications",
    href: "/craftworker/dashboard/applications",
    icon: <Bookmark className="w-5 h-5" />,
  },
  {
    title: "Profile",
    href: "/craftworker/dashboard/profile",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Settings",
    href: "/craftworker/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function CraftworkerSidebar({ isOpen, onClose }) {
  return <DashboardSidebar menuItems={craftworkerMenuItems} isOpen={isOpen} onClose={onClose} />;
}

