"use client";
import { LayoutDashboard, Briefcase, FileText, Users } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const companyMenuItems = [
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "Jobs",
    href: "/company/dashboard/jobs",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    title: "Applicants",
    href: "/company/dashboard/applicants",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Profile",
    href: "/company/dashboard/profile",
    icon: <FileText className="w-5 h-5" />,
  },
];

export default function CompanySidebar({ isOpen, onClose }) {
  return <DashboardSidebar menuItems={companyMenuItems} isOpen={isOpen} onClose={onClose} />;
}

