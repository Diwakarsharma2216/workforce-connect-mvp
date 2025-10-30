"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HiMenu } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-brand-purple tracking-tight">WorkForce-Mangement</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-gray-700 hover:text-brand-purple font-medium transition">How it works</a>
          <a href="#about" className="text-gray-700 hover:text-brand-purple font-medium transition">About</a>
          <a href="#jobs" className="text-gray-700 hover:text-brand-purple font-medium transition">Browse Jobs</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="text-brand-blue font-semibold hover:text-brand-purple/80 transition px-4 py-2">Recruiter Login</Button>
          <Button className="bg-brand-blue text-white font-semibold hover:bg-brand-purple transition rounded-full px-5 py-2">Register</Button>
        </div>
        <button className="md:hidden flex items-center p-2" onClick={() => setOpen(p => !p)} aria-label="open menu">
          <HiMenu className="w-7 h-7 text-brand-purple" />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t px-4 pb-4 animate-fadein">
          <a href="#how-it-works" className="block py-2 font-medium text-gray-700 hover:text-brand-purple">How it works</a>
          <a href="#about" className="block py-2 font-medium text-gray-700 hover:text-brand-purple">About</a>
          <a href="#jobs" className="block py-2 font-medium text-gray-700 hover:text-brand-purple">Browse Jobs</a>
          <div className="flex flex-col gap-2 mt-4">
            <Button variant="ghost" className="block w-full text-left text-brand-blue font-semibold hover:text-brand-purple transition">Recruiter Login</Button>
            <Button className="block w-full text-left bg-brand-blue text-white px-5 py-2 rounded-full font-semibold hover:bg-brand-purple transition">Register</Button>
          </div>
        </div>
      )}
    </nav>
  );
}