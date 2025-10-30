"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HiMenu } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);



  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-primary">
            WorkForce-Management
          </span>
        </a>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#home" className="text-muted-foreground hover:text-foreground font-medium transition">Home</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground font-medium transition">How it works</a>
          <a href="#about" className="text-muted-foreground hover:text-foreground font-medium transition">About</a>
          <a href="#jobs" className="text-muted-foreground hover:text-foreground font-medium transition">Browse Jobs</a>
        </div>
        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className="btn-outline" onClick={() => window.location.href = "/select-role?type=login"}>Login</button>
          <button className="btn-primary rounded-full px-5" onClick={() => window.location.href = "/select-role?type=signup"}>Register</button>
        </div>
        {/* Mobile menu toggle */}
        <button className="md:hidden flex items-center p-2" onClick={() => setOpen((p) => !p)} aria-label="open menu">
          <HiMenu className="w-7 h-7 text-primary" />
        </button>
      </div>
      {/* Mobile menu dropdown */}
      {open && (
        <div className="md:hidden bg-card border-t border-border px-4 pb-4 animate-fadein rounded-b-lg shadow">
          <a href="#home" className="block py-2 font-medium text-muted-foreground hover:text-foreground">Home</a>
          <a href="#how-it-works" className="block py-2 font-medium text-muted-foreground hover:text-foreground">How it works</a>
          <a href="#about" className="block py-2 font-medium text-muted-foreground hover:text-foreground">About</a>
          <a href="#jobs" className="block py-2 font-medium text-muted-foreground hover:text-foreground">Browse Jobs</a>
          <div className="flex flex-col gap-2 mt-4">
            <button className="btn-outline" onClick={() => window.location.href = "/select-role?type=login"}>Login</button>
            <button className="btn-primary rounded-full px-5" onClick={() => window.location.href = "/select-role?type=signup"}>Register</button>
          </div>
        </div>
      )}
    </nav>
  );
}