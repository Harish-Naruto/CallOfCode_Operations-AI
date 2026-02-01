"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import apiClient from "@/lib/api/client";
import { motion } from "framer-motion";
import { 
  ShieldAlert, Clock, User, Fingerprint, 
  Layers, Activity, Compass, ChevronRight 
} from "lucide-react";

type AuditLogEntry = {
  id: string;
  action: string;
  actor: string;
  createdAt: string;
};

type AuditLogResponse = {
  data: AuditLogEntry[];
  pagination: {
    page: number;
    pageSize?: number;
    totalPages: number;
    totalItems?: number;
  };
};

export default function AuditPage() {
  // --- YOUR LOGIC: UNTOUCHED ---
  const [response, setResponse] = useState<AuditLogResponse | null>(null);

  useEffect(() => {
    apiClient
      .get<AuditLogResponse>("/api/owner/audit")
      .then((res) => setResponse(res.data))
      .catch(console.error);
  }, []);

  if (!response) return (
    <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0077B6]">Retrieving Logs...</p>
      </div>
    </div>
  );

  // --- DESIGN: TACTICAL AUDIT INTERFACE ---
  return (
    <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
      {/* FIX: Ensure the root container is scrollable and utilizes the custom scrollbar class.
          By using 'overflow-y-auto' on a 'min-h-screen' element, we ensure content can expand.
      */}
      <div className="min-h-screen w-full bg-[#E0F2F1] overflow-y-auto custom-scrollbar relative font-sans">
        
        {/* Background Decorative Glows */}
        <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto p-6 md:p-12 lg:p-16 space-y-10 relative z-10"
        >
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#001D29]/10 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#001D29] rounded-xl shadow-lg shadow-[#001D29]/20">
                  <ShieldAlert className="w-5 h-5 text-[#48CAE4]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0077B6]">System Security</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-[#001D29] tracking-tighter italic leading-none">
                Audit <span className="text-[#00B4D8]">Intelligence</span>
              </h1>
            </div>

            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/60 shadow-sm">
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#0077B6] opacity-60">Session Status</p>
                <p className="text-sm font-bold text-[#001D29] leading-none uppercase">Authorized Node</p>
              </div>
              <Activity className="w-5 h-5 text-[#00B4D8] animate-pulse" />
            </div>
          </header>

          {/* Tactical Log Grid */}
          <div className="grid gap-4">
            {response.data.map((log, idx) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group relative bg-[#001D29] rounded-[2rem] p-6 text-white shadow-xl shadow-[#001D29]/10 overflow-hidden hover:bg-[#002535] transition-all"
              >
                {/* Visual Watermark for Industrial Feel */}
                <Fingerprint className="absolute right-[-1rem] top-[-1rem] w-24 h-24 text-white/5 -rotate-12" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#00B4D8] group-hover:border-[#00B4D8] transition-all duration-300">
                      <Compass className="w-5 h-5 text-[#48CAE4] group-hover:text-white" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-bold tracking-wide text-white uppercase group-hover:text-[#48CAE4] transition-colors">{log.action}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                          <User className="w-3 h-3 text-[#00B4D8]" />
                          {log.actor}
                        </div>
                        <div className="h-3 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                          <Clock className="w-3 h-3 text-[#00B4D8]" />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <p className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Entry Hash</p>
                      <p className="text-[10px] font-mono text-white/40">{log.id.slice(0, 8)}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-white/20 group-hover:text-[#48CAE4] transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination & Footer Branding */}
          <footer className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-[#001D29]/5">
            <div className="flex items-center gap-3 px-6 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/60">
              <Layers className="w-4 h-4 text-[#0077B6]" />
              <p className="text-[10px] font-black text-[#001D29] uppercase tracking-[0.3em]">
                Page {response.pagination.page} / {response.pagination.totalPages}
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 opacity-[0.05] pointer-events-none select-none">
              <span className="text-6xl font-serif font-black italic text-[#001D29]">MSME_SECURE</span>
            </div>
          </footer>
        </motion.div>
      </div>

      {/* Global Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00B4D8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0077B6;
        }
      `}</style>
    </ProtectedRoute>
  );
}