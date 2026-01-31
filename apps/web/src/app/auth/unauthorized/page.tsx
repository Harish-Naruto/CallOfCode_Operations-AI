import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <div className="text-6xl font-bold text-destructive mb-2">403</div>
                    <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">
                        You don't have permission to access this page. This page is restricted to specific user roles.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/auth/login"
                        className="block w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
                    >
                        Go to Login
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-2 px-4 border border-input rounded-md hover:bg-muted font-medium transition-colors"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
