"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import apiClient from "@/lib/api/client";
import { motion } from "framer-motion";
import {
  User, ClipboardList, ShieldAlert, Clock,
  ArrowLeft, CheckCircle2, Hash, Layers,
  UserCheck, Activity, Compass
} from "lucide-react";
import Link from "next/link";
import { ownerService } from "@/lib/api/owner.service";
import type { WorkerSummary } from "@/lib/api/owner.service";

type RequestDetailResponse = {
  request: {
    id: number | string;
    status: string;
    customer?: {
      name: string;
      email?: string | null;
    } | null;
  };
  tasks: Array<{
    id: number | string;
    status: string;
    worker?: {
      name: string;
    } | null;
  }>;
  auditActions: Array<{
    id: number | string;
    action: string;
    actor: string;
    createdAt: string;
    reason?: string | null;
  }>;
};

export default function OwnerRequestDetailPage() {
  // --- LOGIC: UNTOUCHED ---
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RequestDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<RequestDetailResponse>(`/api/owner/requests/${id}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0077B6]">Syncing Terminal...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#E0F2F1] flex items-center justify-center text-[#001D29] font-serif font-bold italic">
      Node Reference Not Found.
    </div>
  );

  const { request, tasks, auditActions } = data;

  return (
    <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
      {/* FIX: Changed overflow-hidden to overflow-y-auto to allow scrolling */}
      <div className="min-h-screen w-full bg-[#E0F2F1] overflow-y-auto custom-scrollbar relative font-sans">

        {/* Background Aesthetic Orbs */}
        <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto p-4 md:p-10 lg:p-14 space-y-8 relative z-10"
        >
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <Link href="/owner/requests" className="group flex items-center gap-3 text-[#001D29] hover:text-[#00B4D8] transition-colors">
              <div className="p-3 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Return to Archive</span>
            </Link>

            <div className="flex items-center gap-4 px-6 py-3 bg-[#001D29] rounded-[1.5rem] shadow-2xl border border-white/5">
              <Compass className="w-5 h-5 text-[#48CAE4]" />
              <div className="h-6 w-[1px] bg-white/10" />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Audit Authority</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">

            {/* LEFT: Request Identity Module */}
            <div className="lg:col-span-4 space-y-8">
              <section className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[3rem] p-10 shadow-xl">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-[#001D29] rounded-[2rem] flex flex-col items-center justify-center text-[#48CAE4] shadow-xl">
                    <Hash className="w-4 h-4 opacity-40 mb-1" />
                    <span className="text-xl font-black">{request.id.toString().slice(-3)}</span>
                  </div>

                  <div>
                    <h1 className="text-3xl font-serif font-black text-[#001D29] tracking-tighter italic">Data Node</h1>
                    <div className={`mt-3 inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${request.status.toLowerCase() === 'pending'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-[#E0F2F1] text-[#0077B6] border-[#CAF0F8]'
                      }`}>
                      {request.status}
                    </div>
                  </div>
                </div>

                {request.customer && (
                  <div className="mt-12 pt-10 border-t border-[#001D29]/5 space-y-6">
                    <div className="flex items-center gap-4 group">
                      <div className="p-3 bg-[#001D29] rounded-xl group-hover:bg-[#0077B6] transition-colors">
                        <User className="w-5 h-5 text-[#48CAE4]" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-[#0077B6] uppercase tracking-widest">Customer</p>
                        <p className="text-sm font-bold text-[#001D29]">{request.customer.name}</p>
                        <p className="text-xs text-[#001D29]/40">{request.customer.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <div className="p-8 border-2 border-dashed border-[#00B4D8]/20 rounded-[2.5rem] flex flex-col items-center text-center bg-white/10">
                <Activity className="w-6 h-6 text-[#00B4D8] mb-3 opacity-50" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00B4D8]">
                  Integrity Monitor Active
                </p>
              </div>
            </div>

            {/* RIGHT: Tasks & Audit Intelligence */}
            <div className="lg:col-span-8 space-y-8">

              {/* MANUAL ASSIGNMENT UI - Correctly placed here */}
              <ManualAssignment requestId={request.id.toString()} />

              {/* Tasks Module */}
              <section className="bg-[#001D29] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <h3 className="text-xl font-serif font-bold italic text-[#48CAE4] flex items-center gap-3">
                    <ClipboardList className="w-5 h-5" /> Assigned Tasks
                  </h3>

                  <div className="grid gap-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-[#00B4D8] transition-colors">
                            <CheckCircle2 className="w-5 h-5 group-hover:text-white text-[#00B4D8]" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-[#48CAE4]">Task #{task.id}</p>
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">{task.status}</p>
                          </div>
                        </div>

                        {task.worker && (
                          <div className="mt-4 md:mt-0 flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <UserCheck className="w-4 h-4 text-[#00B4D8]" />
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest leading-none">{task.worker.name}</p>
                              <p className="text-[8px] text-white/30 uppercase mt-0.5">Artisan Assigned</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Layers className="absolute right-[-2rem] top-[-2rem] w-64 h-64 text-white/5 -rotate-12 pointer-events-none" />
              </section>

              {/* Audit Intelligence Module */}
              <section className="bg-white/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-lg">
                <h3 className="text-xl font-serif font-bold italic text-[#001D29] mb-8 flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-[#0077B6]" /> Audit Intelligence
                </h3>

                <div className="space-y-8">
                  {auditActions.map((log) => (
                    <div key={log.id} className="relative pl-8 border-l-2 border-[#00B4D8]/20 group">
                      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-[#00B4D8] shadow-[0_0_10px_rgba(0,180,216,0.5)] group-hover:scale-150 transition-transform" />

                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <p className="text-sm font-bold text-[#001D29] uppercase tracking-wide">{log.action}</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-[#00B4D8] uppercase bg-[#00B4D8]/10 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-[#001D29]/40 font-black uppercase tracking-[0.2em]">
                          Actor Instance: {log.actor}
                        </div>

                        {log.reason && (
                          <div className="mt-3 p-4 bg-[#001D29] text-[#48CAE4] rounded-2xl text-[10px] italic font-medium border border-white/5">
                            System Reason: {log.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>

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

function ManualAssignment({ requestId }: { requestId: string }) {
  const [workers, setWorkers] = useState<WorkerSummary[]>([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    ownerService
      .listWorkers()
      .then(setWorkers)
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const handleAssign = async () => {
    if (!selectedWorker) return;
    setLoading(true);
    try {
      await ownerService.forceAssign(requestId, selectedWorker, "Manual override by owner");
      window.location.reload();
    } catch (err) {
      console.error("Assignment failed", err);
      alert("Failed to assign worker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-amber-500/10 border border-amber-500/30 rounded-[3rem] p-10 shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-xl font-serif font-bold italic text-[#001D29] mb-6 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <span>Manual Force Override</span>
        </h3>

        <div className="bg-white/60 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-end md:items-center">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#0077B6] pl-1">Target Artisan Node</label>
            <select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              disabled={fetching}
              className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-[#00B4D8] text-[#001D29] font-bold outline-none transition-all shadow-sm"
            >
              <option value="">{fetching ? "Syncing Network..." : "Select Available Worker..."}</option>
              {workers.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.status} ({w.activeTaskCount} active)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAssign}
            disabled={!selectedWorker || loading}
            className="w-full md:w-auto px-8 py-4 bg-[#001D29] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#0077B6] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xl"
          >
            {loading ? "Re-Routing..." : "Execute Assign"}
          </button>
        </div>

        <p className="mt-4 text-[10px] font-bold text-amber-800/60 uppercase tracking-widest text-center md:text-left ml-1">
          * This action bypasses the autonomous agent's decision matrix.
        </p>
      </div>

      {/* Background Graphic */}
      <div className="absolute right-[-2rem] top-[-4rem] opacity-5 pointer-events-none select-none">
        <Activity className="w-64 h-64 text-amber-900 rotate-12" />
      </div>
    </section>
  );
}