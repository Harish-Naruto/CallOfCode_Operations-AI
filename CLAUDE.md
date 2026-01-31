# CLAUDE.md
## Decision-Centric Agentic AI for MSME Operations


## 1. Core Identity of the System

This system is a **Decision-Centric, Agentic Operations Manager** for MSMEs.

It is designed to act like a **Digital COO**, not a chatbot, workflow engine, or dashboard.

Its primary responsibility is:

> **To continuously decide what should happen next and ensure it happens.**

---

## 2. What This System IS

- A continuous **observe → decide → act** control system
- A **stateful operational agent**
- A decision owner, not a suggestion engine
- A system that intervenes when work is delayed or at risk
- A manager that re-plans as reality changes

---

## 3. What This System is NOT

The system must never be treated as:

- ❌ A CRM
- ❌ A traditional ERP
- ❌ A task tracker
- ❌ A static workflow engine
- ❌ A one-shot LLM prompt
- ❌ A chat-first product

Chat interfaces (e.g., WhatsApp) are **input channels**, not the system itself.

---

## 4. Primary Mental Model

All reasoning must follow this continuous loop:

OBSERVE → BUILD CONTEXT → DECIDE → VALIDATE → EXECUTE → MONITOR → RE-DECIDE


If a feature, agent, or function does not clearly map to **one or more steps** in this loop, it likely does not belong.

---

## 5. System-Wide Design Principle

### Agency over Automation

This system:
- Owns decisions
- Re-evaluates them continuously
- Acts proactively
- Escalates when blocked

If humans must manually coordinate day-to-day operations, the system has failed.

---

## 6. Unified Operational State (Source of Truth)

The system maintains a **single live operational state**, including:

- Orders and commitments
- Inventory and constraints
- Staff availability and workload
- Tasks and ownership
- Decision history (for explainability, not analytics)

This state is:
- Mutable
- Current
- Operational (not historical reporting)

Key question this state must answer:
> “If I were the operations manager right now, what do I believe to be true?”

---

## 7. Agent Responsibilities (Strict Separation of Concerns)

### 7.1 Observer Agent
**Purpose:** Detect change

- Monitors inputs (WhatsApp, spreadsheets, calls, manual updates)
- Detects events, anomalies, and state changes
- Does NOT interpret, reason, or decide

Rule:
> Observation must be dumb, fast, and reliable.

---

### 7.2 Context Builder Agent
**Purpose:** Create a decision-ready snapshot

- Extracts only relevant information
- Removes noise and redundancy
- Compresses state into a reasoning-friendly format

Rule:
> The LLM should never see raw operational data.

---

### 7.3 Supervisor Decision Agent (LLM)
**Purpose:** Decide the next best action

- Reasons about priorities, constraints, and trade-offs
- Chooses a concrete next action
- Acts as a planner, not an executor

Hard requirement:
> The system must decide — not list options.

Decisions must be:
- Contextual
- Reversible
- Explainable

---

### 7.4 Validator Agent
**Purpose:** Enforce safety and correctness

- Checks feasibility, constraints, and rules
- Prevents hallucinated or unsafe actions
- Rejects invalid decisions and sends feedback for correction

Rule:
> No decision reaches execution without validation.

---

### 7.5 Execution Agent
**Purpose:** Change the real world

- Applies validated decisions deterministically
- Updates state, assigns tasks, sends messages, triggers actions
- Must be idempotent and retry-safe

Rule:
> Execution contains no reasoning.

---

### 7.6 Monitoring & Reflection Agent
**Purpose:** Ensure decisions actually worked

- Tracks task progress and outcomes
- Detects delays, failures, or unexpected changes
- Triggers re-decision or escalation

Rule:
> Silence is failure — outcomes must be observed.

---

### 7.7 Rule-Based Fallback Logic
**Purpose:** System reliability

- Activated when LLM fails, loops, or becomes unreliable
- Applies deterministic, conservative decisions

Rule:
> The system must degrade safely, never halt blindly.

---

## 8. Decision Quality Heuristics

When trade-offs exist, prefer:

1. Keeping customer commitments over starting new work
2. Reducing bottlenecks over maximizing throughput
3. Clear ownership over speed
4. Small reversible actions over large irreversible ones
5. Escalation over silent failure

---

## 9. Autonomy Levels

The system may operate in:

- **Shadow Mode** – suggestions only
- **Assisted Mode** – human approval required
- **Autonomous Mode** – direct execution

However:
> Decision ownership always remains with the system.

---

## 10. Scope Discipline (Critical)

This system must be built for **one MSME niche at a time**.

DO NOT:
- Generalize prematurely
- Build abstract universal frameworks
- Optimize for elegance over realism

DO:
- Encode real constraints
- Model messy inputs
- Optimize for operational correctness

---

## 11. How to Evaluate Any New Feature

Before adding anything, answer:

1. What decision does this help the system make?
2. What new observation does it introduce?
3. How does it update the live operational state?
4. What action does it enable or improve?

If any answer is unclear, the feature is incomplete.

---

## 12. Expected AI Behavior

When reasoning or generating code:

- Think like an operations manager
- Assume information is incomplete and noisy
- Prefer action over analysis paralysis
- Re-plan aggressively when conditions change
- Always close the loop

---

## 13. Final Reminder

This system exists to **remove the MSME owner from daily firefighting**.

If a design choice:
- Increases manual coordination
- Pushes decisions back to humans
- Hides failures instead of escalating them

…it violates the core purpose of this project.

**This is a decision-owning system, not a support tool.**
