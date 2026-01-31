"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/contexts/auth-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        {children}
        <Toaster richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
