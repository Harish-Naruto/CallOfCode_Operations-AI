"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { UserRole } from "@/lib/types/auth";
import { toast } from "sonner";
import Link from "next/link";
import {
    Mail, Lock, User, Phone, MapPin, Wrench,
    Users, Briefcase, ShieldCheck, ArrowRight, Loader2,
    CheckCircle2
} from "lucide-react";

export default function SignupPage() {
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

            // Redirect based on role
            switch (selectedRole) {
                case UserRole.CUSTOMER:
                    router.push("/customer/dashboard");
                    break;
                case UserRole.WORKER:
                    router.push("/worker/dashboard");
                    break;
                case UserRole.OWNER:
                    router.push("/owner/dashboard");
                    break;
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Signup failed");
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case UserRole.CUSTOMER:
                return <Users className="w-4 h-4" />;
            case UserRole.WORKER:
                return <Briefcase className="w-4 h-4" />;
            case UserRole.OWNER:
                return <ShieldCheck className="w-4 h-4" />;
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/20">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-card border border-border rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                        <p className="text-sm text-muted-foreground">
                            Join our platform and get started
                        </p>
                    </div>

                    {/* Role Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Select Account Type</label>
                        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
                            {Object.values(UserRole).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setSelectedRole(role)}
                                    className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-md text-xs font-medium transition-all duration-200 ${selectedRole === role ? "bg-background text-foreground shadow-md scale-105" : "text-muted-foreground hover:text-foreground hover:bg-background/50"}`}
                                >
                                    {getRoleIcon(role)}
                                    <span className="capitalize">
                                        {role.toLowerCase()}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                                    placeholder="+1234567890"
                                />
                            </div>
                        </div>

                        {/* Customer-specific: Address */}
                        {selectedRole === UserRole.CUSTOMER && (
                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-medium">
                                    Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <textarea
                                        id="address"
                                        name="address"
                                        required
                                        rows={2}
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50 resize-none"
                                        placeholder="123 Main St, City, Country"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Worker-specific: Skills */}
                        {selectedRole === UserRole.WORKER && (
                            <div className="space-y-2">
                                <label htmlFor="skills" className="text-sm font-medium">
                                    Skills <span className="text-muted-foreground text-xs">(comma-separated)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Wrench className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="skills"
                                        name="skills"
                                        type="text"
                                        required
                                        value={formData.skills}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                                        placeholder="Tailoring, Alteration, Stitching"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create account</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link
                        href="/auth/login"
                        className="block w-full py-3 px-4 text-center font-medium border border-border rounded-lg hover:bg-muted/50 transition-all duration-200"
                    >
                        Sign in instead
                    </Link>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-muted-foreground">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
