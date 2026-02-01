"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { customerService } from "@/lib/api/customer.service";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Hash, Layers, 
  Activity, Compass, Box, Clock, ShieldCheck, History,
  ExternalLink, Fingerprint, Cpu, Search, CheckCircle2
} from "lucide-react";

export default function CustomerRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!id) return;
    customerService.getRequestDetail(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-2 border-[#00B4D8]/20 rounded-full" />
        <div className="absolute top-0 w-20 h-20 border-t-2 border-[#0077B6] rounded-full animate-spin" />
        <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.4em] text-[#0077B6] whitespace-nowrap">Decoding Node...</p>
      </div>
    </div>
  );
  
  if (!data) return (
    <div className="min-h-screen bg-[#E0F2F1] flex flex-col items-center justify-center gap-6">
      <ShieldCheck className="w-16 h-16 text-[#001D29]/10" />
      <p className="text-sm font-black uppercase tracking-[0.3em] text-[#001D29]">Access Denied: Node Null</p>
      <button onClick={() => router.back()} className="px-6 py-2 bg-[#001D29] text-white rounded-full text-[10px] font-black uppercase tracking-widest">Return to Base</button>
    </div>
  );

  const { request, auditActions } = data;

  return (
    <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
      <div className="min-h-screen w-full bg-[#E0F2F1] text-[#001D29] relative overflow-x-hidden font-sans pb-20">
        
        {/* Artistic Background Overlays */}
        <div className="fixed top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-[#00B4D8]/10 to-transparent rounded-full blur-[140px]" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-[#0077B6]/5 rounded-full blur-[100px]" />
        </div>

        {/* Floating Top Navigation */}
        <nav className="sticky top-6 z-50 max-w-6xl mx-auto px-4">
            <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,29,41,0.05)]">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-3 px-4 py-2 bg-[#001D29] text-white rounded-2xl hover:bg-[#0077B6] transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </button>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-[8px] font-black text-[#0077B6] uppercase tracking-[0.3em]">Integrity Check</p>
                        <p className="text-[10px] font-mono font-bold">Node_{request.id.toString().slice(-6)}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-[#001D29]/10" />
                    <Fingerprint className="w-5 h-5 text-[#001D29] opacity-40" />
                </div>
            </div>
        </nav>

        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto mt-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10"
        >
          {/* 1. Left Feature: Project Status Monolith */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-[#001D29] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden h-fit">
                <div className="relative z-10 space-y-10">
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                            <Cpu className="w-6 h-6 text-[#48CAE4]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">2026_Audit</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-5xl font-serif font-black italic tracking-tighter leading-none">
                            Request<br/>
                            <span className="text-[#00B4D8]">Vitals.</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Detailed Operations Trace</p>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-white/10">
                        <div className="flex justify-between items-center group">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status Code</span>
                            <span className="px-4 py-1.5 bg-[#00B4D8]/20 text-[#48CAE4] rounded-full text-[9px] font-black uppercase tracking-widest border border-[#00B4D8]/30">
                                {request.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Reference</span>
                            <span className="text-sm font-bold font-mono">#{request.id.toString().slice(0, 12)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Timestamp</span>
                            <span className="text-sm font-bold">{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <Layers className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 -rotate-12 pointer-events-none" />
            </section>

            {/* Manifest Preview (Artisan Specs) */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Box className="w-4 h-4 text-[#0077B6]" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001D29]">Request Payload</h4>
                </div>
                <div className="bg-white/80 p-6 rounded-3xl shadow-inner border border-[#001D29]/5">
                    <div className="space-y-4">
                        {request.payload && Object.entries(request.payload).map(([key, value]: any) => (
                            <div key={key} className="flex flex-col gap-1 border-b border-[#001D29]/5 pb-2 last:border-0">
                                <span className="text-[8px] font-black text-[#0077B6] uppercase tracking-widest">{key}</span>
                                <span className="text-xs font-bold text-[#001D29]">{typeof value === 'object' ? 'Structured Data' : String(value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* 2. Right Feature: The Event Nexus (Timeline) */}
          <div className="lg:col-span-8">
            <div className="bg-white/60 backdrop-blur-3xl border border-white/80 rounded-[3.5rem] p-10 shadow-sm min-h-[700px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                    <div>
                        <h2 className="text-3xl font-serif font-black italic tracking-tight text-[#001D29] flex items-center gap-3">
                            <History className="w-8 h-8 text-[#0077B6]" /> Operation Log
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0077B6] mt-2">Sequential Integrity Ledger</p>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[9px] font-black tracking-widest uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Encrypted & Verified
                    </div>
                </div>

                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[26px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#001D29]/5 before:via-[#0077B6]/20 before:to-[#001D29]/5">
                    {auditActions.map((log: any, idx: number) => (
                        <motion.div 
                            key={log.id} 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative pl-20 group"
                        >
                            {/* Point Indicator */}
                            <div className="absolute left-[18px] top-2 w-[18px] h-[18px] bg-[#E0F2F1] border-2 border-[#00B4D8] rounded-full z-10 group-hover:scale-150 transition-transform duration-500 flex items-center justify-center">
                                <div className="w-1 h-1 bg-[#001D29] rounded-full" />
                            </div>
                            
                            <div className="bg-white/70 p-8 rounded-[2.5rem] border border-white group-hover:bg-white group-hover:shadow-xl group-hover:shadow-[#0077B6]/5 transition-all duration-500">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-[#00B4D8] uppercase tracking-[0.2em]">Activity Node</p>
                                        <h4 className="text-xl font-bold tracking-tighter text-[#001D29] uppercase">{log.action.replace(/_/g, " ")}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-mono font-black text-[#001D29]/40">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                        <p className="text-[8px] font-bold text-[#0077B6] uppercase tracking-widest">{new Date(log.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-[#001D29]/5">
                                    <div className="w-10 h-10 rounded-xl bg-[#001D29] flex items-center justify-center text-[#48CAE4]">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-[#001D29]/30 uppercase tracking-[0.2em] mb-1">Authenticated Actor</p>
                                        <p className="text-xs font-bold text-[#001D29] uppercase tracking-widest">{log.actor}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-[#001D29]/10 group-hover:text-[#0077B6] transition-colors" />
                                </div>

                                {log.reason && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        whileInView={{ height: 'auto', opacity: 1 }}
                                        className="mt-6 p-5 bg-[#001D29] text-[#48CAE4] rounded-3xl text-xs font-medium relative overflow-hidden italic"
                                    >
                                        <div className="relative z-10">"{log.reason}"</div>
                                        <Layers className="absolute right-[-10%] bottom-[-20%] w-20 h-20 opacity-10" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {auditActions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/40 border-2 border-dashed border-[#001D29]/5 rounded-[3rem]">
                            <Activity className="w-12 h-12 text-[#001D29]/5 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001D29]/30 italic">Registry awaiting synchronization</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </motion.main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00B4D8; border-radius: 10px; border: 2px solid #E0F2F1; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0077B6; }
      `}</style>
    </ProtectedRoute>
  );
}