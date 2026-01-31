"use client";

import Link from "next/link";
import {
  Brain,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Activity,
  Target,
  BarChart3,
  Clock,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">
                Decision AI
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/auth/login"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">
              Decision-Centric AI for MSME Operations
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            Your Digital{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              COO
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-200">
            Autonomous operations management for MSMEs. We don't just suggest —
            we <span className="text-indigo-400 font-semibold">decide</span>,{" "}
            <span className="text-indigo-400 font-semibold">execute</span>, and{" "}
            <span className="text-indigo-400 font-semibold">optimize</span>{" "}
            your daily operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <div className="text-3xl font-bold text-indigo-400 mb-2">
                95%
              </div>
              <div className="text-sm text-slate-400">
                Reduction in Manual Coordination
              </div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                24/7
              </div>
              <div className="text-sm text-slate-400">
                Autonomous Operations
              </div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <div className="text-3xl font-bold text-pink-400 mb-2">
                10x
              </div>
              <div className="text-sm text-slate-400">Faster Decisions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Autonomous Operations Intelligence
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Not a chatbot. Not a dashboard. A true decision-owning system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Activity,
                title: "Continuous Decision Loop",
                description:
                  "Observe → Decide → Execute → Monitor. Real-time adaptive planning that never sleeps.",
                gradient: "from-indigo-500 to-blue-500",
              },
              {
                icon: Target,
                title: "Promise Validation",
                description:
                  "Validates every commitment against inventory, staff, and constraints before confirming.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Users,
                title: "Smart Task Assignment",
                description:
                  "Automatically assigns work based on skills, availability, and bottleneck detection.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: Zap,
                title: "Proactive Intervention",
                description:
                  "Detects delays and issues before they become problems. Auto-escalates when needed.",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                icon: BarChart3,
                title: "Real-Time Replanning",
                description:
                  "Adjusts plans dynamically as conditions change. No manual rescheduling needed.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Shield,
                title: "Full Audit Trail",
                description:
                  "Every decision is logged and explainable. Know exactly why the system chose each action.",
                gradient: "from-purple-500 to-indigo-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From customer request to completion — automated end-to-end
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: "01",
                title: "Customer Places Order",
                description:
                  "Via WhatsApp, web, or call. Any channel works seamlessly.",
                icon: Users,
              },
              {
                step: "02",
                title: "AI Validates & Plans",
                description:
                  "Checks inventory, staff availability, and dependencies. Confirms realistic delivery promise.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Smart Assignment",
                description:
                  "Auto-assigns tasks to the right workers based on skills, workload, and urgency.",
                icon: Target,
              },
              {
                step: "04",
                title: "Continuous Monitoring",
                description:
                  "Tracks progress in real-time. Intervenes if delays detected. Re-plans automatically.",
                icon: Activity,
              },
              {
                step: "05",
                title: "Completion & Handoff",
                description:
                  "Ensures quality checks. Updates customer. Triggers next steps automatically.",
                icon: CheckCircle2,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 items-start p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="text-sm text-indigo-400 font-semibold mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl">
            <Clock className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stop Firefighting. Start Growing.
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join MSMEs that have eliminated 95% of manual coordination and
              freed up their time for strategic growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50 flex items-center justify-center gap-2"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-white/5 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-400" />
              <span className="text-white font-semibold">Decision AI</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2026 Decision AI. Built for MSMEs who want to scale.
            </div>
            <div className="flex gap-6">
              <Link
                href="/auth/login"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
