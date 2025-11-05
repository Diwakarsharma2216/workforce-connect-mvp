"use client";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { HiMenu } from "react-icons/hi";
import { User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { logoutUser } from "@/store/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user, profile } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Get user display name
  const getUserDisplayName = () => {
    if (profile) {
      if (profile.companyName) return profile.companyName;
      if (profile.fullName) return profile.fullName;
    }
    return user?.email || "User";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
    router.push("/");
  };

  // Handle dashboard navigation
  const handleDashboard = () => {
    setUserMenuOpen(false);
    if (user?.role === "company") {
      router.push("/company/dashboard");
    } else if (user?.role === "provider") {
      router.push("/provider/dashboard");
    } else if (user?.role === "craftworker") {
      router.push("/craftworker/dashboard");
    } else {
      router.push("/");
    }
  };

  // Handle profile navigation
  const handleProfile = () => {
    setUserMenuOpen(false);
    router.push("/profile");
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-primary">
          Turnaround Chaser
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#home" className="text-muted-foreground hover:text-foreground font-medium transition">
            Home
          </Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground font-medium transition">
            How it works
          </Link>
          <Link href="#about" className="text-muted-foreground hover:text-foreground font-medium transition">
            About
          </Link>
          <Link href="#jobs" className="text-muted-foreground hover:text-foreground font-medium transition">
            Browse Jobs
          </Link>
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <button className="btn-outline">
              <Link href="/select-role">Login</Link>
            </button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent hover:bg-accent/80 transition-all"
                aria-label="User menu"
              >
                {/* User Avatar Circle */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fadein">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-card-foreground">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleDashboard}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={handleProfile}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center p-2"
          onClick={() => setOpen((p) => !p)}
          aria-label="open menu"
        >
          <HiMenu className="w-7 h-7 text-primary" />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden bg-card border-t border-border px-4 pb-4 animate-fadein rounded-b-lg shadow">
          <a href="#home" className="block py-2 font-medium text-muted-foreground hover:text-foreground">
            Home
          </a>
          <a href="#how-it-works" className="block py-2 font-medium text-muted-foreground hover:text-foreground">
            How it works
          </a>
          <a href="#about" className="block py-2 font-medium text-muted-foreground hover:text-foreground">
            About
          </a>
          <a href="#jobs" className="block py-2 font-medium text-muted-foreground hover:text-foreground">
            Browse Jobs
          </a>
          <div className="flex flex-col gap-2 mt-4">
            {!isAuthenticated ? (
              <button className="btn-outline">
                <Link href="/select-role">Login</Link>
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleDashboard}
                  className="flex items-center gap-2 px-4 py-2 text-left text-card-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleProfile}
                  className="flex items-center gap-2 px-4 py-2 text-left text-card-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-left text-card-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
