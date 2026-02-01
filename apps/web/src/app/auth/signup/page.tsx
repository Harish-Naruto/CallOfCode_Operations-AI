"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { UserRole } from "@/lib/types/auth";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail, Lock, User, Phone, MapPin, Wrench,
    ArrowRight, Loader2, CheckCircle2, Eye, EyeOff, Scissors, Compass, Layers
} from "lucide-react";

export default function SignupPage() {
    // --- Logic: Preserved Exactly ---
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
        skills: "",
    });

    const { registerCustomer, registerWorker, registerOwner, isLoading } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            toast.error("Please fill in all required fields");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        if (selectedRole === UserRole.CUSTOMER && !formData.address) {
            toast.error("Address is required for customers");
            return false;
        }
        if (selectedRole === UserRole.WORKER && !formData.skills) {
            toast.error("Skills are required for workers");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            switch (selectedRole) {
                case UserRole.CUSTOMER:
                    await registerCustomer({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        password: formData.password,
                    });
                    break;
                case UserRole.WORKER:
                    await registerWorker({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
                        password: formData.password,
                    });
                    break;
                case UserRole.OWNER:
                    await registerOwner({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password,
                    });
                    break;
            }
            toast.success("Account created successfully!");
            switch (selectedRole) {
                case UserRole.CUSTOMER: router.push("/customer/dashboard"); break;
                case UserRole.WORKER: router.push("/worker/dashboard"); break;
                case UserRole.OWNER: router.push("/owner/dashboard"); break;
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Signup failed");
        }
    };

    // --- Design: Light Teal Blue Theme [#E0F2F1] ---
    return (
        <div className="min-h-screen w-full bg-[#E0F2F1] flex items-center justify-center p-4 lg:p-10 relative overflow-hidden font-sans selection:bg-[#00B4D8] selection:text-white">
            
            {/* Ambient Background Glows mirroring Dashboard Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row bg-white/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,29,41,0.1)] overflow-hidden border border-white/60"
            >
                {/* Branding Panel: Reuses Midnight Teal [#001D29] leaf shape */}
                <div className="w-full lg:w-[35%] bg-[#001D29] p-10 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-12">
                        <div className="w-16 h-16 bg-[#00B4D8] rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-[#00B4D8]/20">
                            <Scissors className="text-[#001D29] w-8 h-8" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-serif font-bold leading-tight tracking-tight italic">Enrollment <br/> <span className="text-[#48CAE4] font-normal not-italic">Protocol</span></h1>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">Digital Textiles Network Node v.2026.0</p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-[#48CAE4]">
                            <Compass className="w-4 h-4 animate-spin-slow" />
                            <span>System Readiness: Active</span>
                        </div>
                        <div className="h-[1px] w-full bg-white/10" />
                    </div>

                    {/* Watermark consistent with provided login screen */}
                    <Layers className="absolute -bottom-10 -left-10 w-64 h-64 text-white/5 -rotate-12 pointer-events-none select-none" />
                </div>

                {/* Form Content */}
                <div className="flex-1 p-8 lg:p-16 h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-12">
                        
                        {/* Section: Role Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001D29]/40 ml-1">Establish Identity</label>
                            <div className="flex flex-wrap gap-3">
                                {Object.values(UserRole).map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setSelectedRole(role)}
                                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border shadow-sm ${
                                            selectedRole === role 
                                            ? "bg-[#0077B6] border-[#0077B6] text-white shadow-xl -translate-y-0.5" 
                                            : "bg-white/60 border-[#001D29]/5 text-[#001D29] hover:bg-white"
                                        }`}
                                    >
                                        {role.toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section: Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-[#001D29]">
                            <div className="md:col-span-2 flex items-center justify-between">
                                <h3 className="font-serif text-xl font-bold italic tracking-wide">Credential Registry</h3>
                                <div className="h-[1px] flex-1 bg-[#001D29]/5 ml-6" />
                            </div>

                            {[
                                { id: "name", label: "Full Name", icon: User, type: "text", placeholder: "Director Name" },
                                { id: "email", label: "Registry Mail", icon: Mail, type: "email", placeholder: "mail@node.com" },
                                { id: "phone", label: "Secure Line", icon: Phone, type: "tel", placeholder: "000 000 0000" },
                            ].map((field) => (
                                <div key={field.id} className="relative border border-[#001D29]/10 rounded-[1.5rem] p-4 bg-white/40 focus-within:bg-white focus-within:border-[#00B4D8] focus-within:shadow-lg transition-all group">
                                    <label className="absolute -top-2 left-4 bg-[#E0F2F1] px-2 text-[8px] font-black text-[#0077B6] uppercase tracking-[0.2em] group-focus-within:text-[#001D29]">
                                        {field.label}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <field.icon className="w-4 h-4 text-[#00B4D8]" />
                                        <input
                                            name={field.id}
                                            type={field.type}
                                            value={formData[field.id as keyof typeof formData]}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none text-[#001D29] font-bold text-xs placeholder:text-[#001D29]/20"
                                            placeholder={field.placeholder}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Adaptive Fields */}
                            <AnimatePresence mode="wait">
                                {selectedRole === UserRole.CUSTOMER && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                        className="relative border border-[#001D29]/10 rounded-[1.5rem] p-4 bg-white/40 md:col-span-1 focus-within:bg-white focus-within:border-[#00B4D8] transition-all"
                                    >
                                        <label className="absolute -top-2 left-4 bg-[#E0F2F1] px-2 text-[8px] font-black text-[#0077B6] uppercase tracking-widest">Geo-Registry</label>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-[#00B4D8] mt-1" />
                                            <textarea name="address" rows={1} value={formData.address} onChange={handleChange} className="w-full bg-transparent outline-none text-[#001D29] font-bold text-xs resize-none placeholder:text-[#001D29]/20" placeholder="Physical Node Address" required />
                                        </div>
                                    </motion.div>
                                )}
                                {selectedRole === UserRole.WORKER && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                        className="relative border border-[#001D29]/10 rounded-[1.5rem] p-4 bg-white/40 md:col-span-1 focus-within:bg-white focus-within:border-[#00B4D8] transition-all"
                                    >
                                        <label className="absolute -top-2 left-4 bg-[#E0F2F1] px-2 text-[8px] font-black text-[#0077B6] uppercase tracking-widest">Specializations</label>
                                        <div className="flex items-center gap-3">
                                            <Wrench className="w-4 h-4 text-[#00B4D8]" />
                                            <input name="skills" type="text" value={formData.skills} onChange={handleChange} className="w-full bg-transparent outline-none text-[#001D29] font-bold text-xs placeholder:text-[#001D29]/20" placeholder="Tailoring, Finish..." required />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="md:col-span-2 flex items-center gap-6 mt-4">
                                <h3 className="font-serif text-xl font-bold italic tracking-wide whitespace-nowrap">Access Encryption</h3>
                                <div className="h-[1px] flex-1 bg-[#001D29]/5" />
                            </div>

                            {/* Password Fields */}
                            {[
                                { id: "password", label: "Access Code", show: showPassword, set: setShowPassword },
                                { id: "confirmPassword", label: "Verify Code", show: showConfirmPassword, set: setShowConfirmPassword }
                            ].map((pass) => (
                                <div key={pass.id} className="relative border border-[#001D29]/10 rounded-[1.5rem] p-4 bg-white/40 focus-within:bg-white focus-within:border-[#00B4D8] transition-all group">
                                    <label className="absolute -top-2 left-4 bg-[#E0F2F1] px-2 text-[8px] font-black text-[#0077B6] uppercase tracking-widest">{pass.label}</label>
                                    <div className="flex items-center gap-3">
                                        <Lock className="w-4 h-4 text-[#00B4D8]" />
                                        <input
                                            name={pass.id}
                                            type={pass.show ? "text" : "password"}
                                            value={formData[pass.id as keyof typeof formData]}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none text-[#001D29] font-bold text-xs"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button type="button" onClick={() => pass.set(!pass.show)} className="text-[#001D29]/20 hover:text-[#00B4D8] transition-colors">
                                            {pass.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit */}
                        <div className="space-y-8 pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-[#001D29] text-[#48CAE4] rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-[#0077B6] hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finalize Enrollment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                            
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-[1px] w-8 bg-[#001D29]/10" />
                                <p className="text-[9px] text-[#001D29]/40 font-black tracking-widest uppercase">
                                    Member of node?{" "}
                                    <Link href="/auth/login" className="text-[#0077B6] underline underline-offset-4 decoration-[#00B4D8] hover:text-[#001D29] transition-all">
                                        Authenticate Entry
                                    </Link>
                                </p>
                                <div className="h-[1px] w-8 bg-[#001D29]/10" />
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #00B4D8; border-radius: 10px; }
            `}</style>
        </div>
    );
}