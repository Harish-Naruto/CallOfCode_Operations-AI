"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    return (
        <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Customer Dashboard</h1>
                            <p className="text-muted-foreground mt-1">
                                Welcome back, {user?.name}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Content */}
                    <div className="grid gap-6">
                        <div className="p-6 border border-border rounded-lg bg-card">
                            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-sm text-muted-foreground">Name</dt>
                                    <dd className="font-medium">{user?.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">Email</dt>
                                    <dd className="font-medium">{user?.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">Phone</dt>
                                    <dd className="font-medium">{user?.phone || "Not provided"}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">Role</dt>
                                    <dd className="font-medium">{user?.role}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="p-6 border border-border rounded-lg bg-card">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="grid gap-3">
                                <button className="p-4 text-left border border-border rounded-md hover:bg-muted transition-colors">
                                    <div className="font-medium">Create New Request</div>
                                    <div className="text-sm text-muted-foreground">Submit a new service request</div>
                                </button>
                                <button className="p-4 text-left border border-border rounded-md hover:bg-muted transition-colors">
                                    <div className="font-medium">View My Requests</div>
                                    <div className="text-sm text-muted-foreground">Track your submitted requests</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
