"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import CompanySidebar from "./CompanySidebar";

export default function CompanyDashboardLayout({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "company") {
      router.push("/select-role");
    }
  }, [isAuthenticated, user, router]);

  // Auto-close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isAuthenticated || user?.role !== "company") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      <CompanySidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <main className="flex-1 w-full md:w-[calc(100%-16rem)] md:ml-64 pt-16 transition-all duration-300">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`
            fixed top-4 left-4 z-30 p-2 rounded-lg 
            bg-card border border-border hover:bg-accent 
            shadow-lg transition-all duration-300
            ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
            md:hidden
          `}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        <div className="p-4 md:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}

