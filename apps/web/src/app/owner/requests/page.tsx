"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, ArrowRight, Activity, Clock, Layers, Hash } from "lucide-react";

type OwnerRequest = {
  id: string;
  status: string;
  createdAt: string;
};

type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function OwnerRequestsPage() {
  // --- LOGIC: UNTOUCHED ---
  const [response, setResponse] =
    useState<PaginatedResponse<OwnerRequest> | null>(null);

  const router = useRouter();

  useEffect(() => {
    apiClient
      .get<PaginatedResponse<OwnerRequest>>("/api/owner/requests")
      .then((res) => setResponse(res.data))
      .catch(console.error);
  }, []);

  // --- DESIGN: OCEANIC ARCHIVE ---
  return (
    <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
      <div className="min-h-screen w-full bg-[#E0F2F1] p-6 md:p-12 lg:p-16 relative overflow-hidden font-sans">
        
        {/* Ambient Decorative Elements */}
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#00B4D8]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#0077B6]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#001D29]/10 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#001D29] rounded-xl shadow-lg">
                  <Compass className="w-5 h-5 text-[#48CAE4]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0077B6]">Director Archive</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-[#001D29] tracking-tighter italic">
                All <span className="text-[#00B4D8]">Requests</span>
              </h1>
            </div>

            {response && (
              <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/60 shadow-sm">
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#0077B6] opacity-60">Global Volume</p>
                  <p className="text-xl font-bold text-[#001D29] leading-none">{response.pagination.total}</p>
                </div>
                <div className="h-8 w-[1px] bg-[#001D29]/10" />
                <Activity className="w-5 h-5 text-[#0077B6]" />
              </div>
            )}
          </header>

          {/* Requests Grid */}
          <div className="grid gap-4">
            {response?.data.map((req, idx) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(`/owner/requests/${req.id}`)}
                className="group relative p-6 bg-white/70 backdrop-blur-sm border border-white/80 rounded-[2rem] shadow-[0_4px_20px_rgba(0,29,41,0.03)] cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-[#0077B6]/10 transition-all flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute left-0 top-0 h-full w-1.5 bg-[#00B4D8] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                <div className="flex items-center gap-6 w-full">
                  <div className="w-14 h-14 bg-[#001D29] rounded-2xl flex flex-col items-center justify-center text-[#48CAE4] shadow-lg group-hover:bg-[#0077B6] transition-colors">
                    <Hash className="w-3 h-3 opacity-40 mb-0.5" />
                    <span className="text-xs font-black">{req.id.slice(-2)}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#001D29] group-hover:text-[#0077B6] transition-colors">Request #{req.id}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#001D29]/40 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {req.createdAt || "Recent Entry"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                    req.status.toLowerCase() === 'pending' 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-[#E0F2F1] text-[#0077B6] border-[#CAF0F8]'
                  }`}>
                    {req.status}
                  </div>
                  <div className="p-3 bg-white border border-[#001D29]/5 rounded-xl text-[#001D29] group-hover:bg-[#001D29] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer & Pagination Meta */}
          {response && (
            <footer className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-[#001D29]/5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0077B6] opacity-30" />
                <p className="text-[10px] font-black text-[#001D29]/30 uppercase tracking-[0.3em]">
                  System Page {response.pagination.page} / {response.pagination.totalPages}
                </p>
              </div>
              <div className="hidden lg:block opacity-5 pointer-events-none select-none">
                <span className="text-6xl font-serif font-black italic text-[#001D29]">Archive</span>
              </div>
            </footer>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}