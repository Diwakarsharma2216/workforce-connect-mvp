"use client";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardSidebar({ menuItems, isOpen, onClose }) {
  const pathname = usePathname();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      // On desktop (md and up), always show sidebar, so close mobile state
      if (window.innerWidth >= 768 && onClose) {
        // Don't close on desktop, just reset state
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          md:hidden
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-card border-r border-border z-50
          w-64 pt-16
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent md:hidden z-10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <nav className="p-4 space-y-2 h-full overflow-y-auto pb-20 md:pb-4">
          {menuItems.map((item) => {
            // Exact match for dashboard
            // For other items, match exact or if pathname starts with the item href followed by /
            const isActive = pathname === item.href || 
              (item.href !== '/company/dashboard' && 
               item.href !== '/provider/dashboard' && 
               item.href !== '/craftworker/dashboard' &&
               pathname?.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile when link is clicked
                  if (window.innerWidth < 768 && onClose) {
                    onClose();
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

