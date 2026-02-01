"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth-context";
import { UserRole } from "@/lib/types/auth";
import { Scissors, Activity, LayoutDashboard, LogIn } from "lucide-react";

export default function Header() {
  const { user } = useAuth(); // Access global auth state

  // Helper to determine the correct dashboard path based on role
  const getDashboardPath = () => {
    switch (user?.role) {
      case UserRole.OWNER:
        return "/owner/dashboard";
      case UserRole.WORKER:
        return "/worker/dashboard";
      case UserRole.CUSTOMER:
        return "/customer/dashboard";
      default:
        return "/auth/login";
    }
  };

  return (
    <header className="w-full relative z-[100] bg-[#001D29] border-b border-white/5 shadow-2xl">
      <div className="max-w-screen-2xl mx-auto flex flex-row items-center justify-between px-6 py-4">
        
        {/* Left Section: Branding */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#00B4D8] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scissors className="w-5 h-5 text-[#001D29]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white">
                MSME <span className="text-[#00B4D8]">Center</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: Conditional Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-l border-white/10 pl-4">
           
            
            {user ? (
              /* LOGGED IN: Show Role-Based Dashboard Button */
              <Link 
                href={getDashboardPath()}
                className="flex items-center gap-2 px-5 py-2 bg-[#0077B6] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#0096C7] transition-all shadow-lg active:scale-95"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {user.role} Dashboard
              </Link>
            ) : (
              /* NOT LOGGED IN: Show Login Button */
              <Link 
                href="/auth/login"
                className="flex items-center gap-2 px-5 py-2 bg-white/5 text-[#00B4D8] border border-[#00B4D8]/30 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#00B4D8]/10 transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                Authenticate
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Visual underline decoration */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00B4D8] to-transparent opacity-30" />
    </header>
  );
}