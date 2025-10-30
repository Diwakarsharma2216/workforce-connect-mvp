// src/components/Footer.jsx
"use client";

import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-2 text-lg font-extrabold text-brand-purple">
          <span>WorkForce-Mangement</span>
          <span className="text-gray-400 font-normal text-xs ml-2">&copy; {new Date().getFullYear()} job-portal. All rights reserved.</span>
        </div>
        {/* Center: Links */}
        <div className="flex gap-4 flex-wrap justify-center">
          <a href="#privacy" className="text-xs text-gray-500 hover:text-brand-purple transition">Privacy Policy</a>
          <a href="#terms" className="text-xs text-gray-500 hover:text-brand-purple transition">Terms</a>
          <a href="#contact" className="text-xs text-gray-500 hover:text-brand-purple transition">Contact</a>
        </div>
        {/* Right: Social icons */}
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-brand-purple text-xl transition">
            <FaFacebook />
          </a>
          <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-brand-purple text-xl transition">
            <FaTwitter />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-brand-purple text-xl transition">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}