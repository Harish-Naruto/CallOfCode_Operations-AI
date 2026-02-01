# CallOfCode Operations AI 🤖

> **A Decision-Centric Agentic AI Operations Manager for MSMEs**

## 📋 Overview

CallOfCode Operations AI is an intelligent operational management system designed specifically for Micro, Small, and Medium Enterprises (MSMEs). Acting as a **Digital Chief Operating Officer (COO)**, this system autonomously manages day-to-day operations through an advanced AI agent architecture built with LangGraph.

Unlike traditional workflow engines or task trackers, this system **owns operational decisions**, continuously observes business state, and acts proactively to optimize resource allocation, prevent bottlenecks, and ensure customer commitments are met.

### Core Philosophy

The system operates on a continuous **OBSERVE → DECIDE → ACT** control loop, functioning as a stateful operational agent that:
- 🎯 Makes autonomous decisions about task assignments and resource allocation
- 🔄 Continuously re-evaluates plans as conditions change
- ⚡ Intervenes proactively when work is delayed or at risk
- 📊 Maintains explainable audit trails for all decisions
- 🚨 Escalates intelligently when blocked or uncertain

## ✨ Key Features

### 🤖 Intelligent Agent System (LangGraph)
- **Multi-Node Decision Graph**: Observe → Orient → Decide → Plan → Act → Respond
- **Context-Aware Reasoning**: Uses Google Generative AI for intelligent decision-making
- **Autonomous Task Assignment**: Automatically assigns workers based on skills, workload, and priorities
- **Promise Validation**: Ensures commitments can be met before accepting requests
- **Bottleneck Detection**: Identifies and resolves operational constraints proactively

### 👥 Multi-Role Dashboard System
- **Customer Dashboard**: Track requests, view status updates, and communicate
- **Worker Dashboard**: View assigned tasks, update progress, manage availability
- **Owner Dashboard**: Full visibility into operations, decision audit trails, and override controls

### 📦 Advanced Inventory Management
- Real-time inventory tracking with Supabase Storage integration
- Image upload support for inventory items
- Automatic reorder point monitoring
- Supplier management and ETA tracking

### 🔐 Robust Authentication & Authorization
- Role-based access control (Owner, Worker, Customer)
- JWT-based authentication with secure cookie management
- Bcrypt password hashing
- Protected routes with middleware validation

### 💬 Multi-Channel Input
- WhatsApp webhook integration for customer requests
- Web-based request submission
- Automated normalization of raw inputs

### 📊 Comprehensive Audit System
- Every decision logged with actor, action, context, and reasoning
- Full traceability of agent decisions
- Request lifecycle tracking
- Performance analytics

## 🏗️ Architecture

### Technology Stack

#### **Monorepo Structure** (Turborepo)
```
CallOfCode_Operations-AI/
├── apps/
│   ├── server/          # Express.js API Backend
│   └── web/             # Next.js Frontend
├── packages/
│   ├── db/              # Prisma Database Layer
│   ├── config/          # Shared TypeScript Configurations
│   └── env/             # Environment Variable Validation
```

#### **Backend Stack**
- **Runtime**: Bun (JavaScript Runtime)
- **Framework**: Express.js 5
- **AI/LLM**: 
  - LangGraph (Stateful Agent Workflows)
  - @langchain/core & @langchain/langgraph
  - Google Generative AI (@google/generative-ai)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase (Image & File Storage)
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod

#### **Frontend Stack**
- **Framework**: Next.js 16 (React 19)
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Forms**: TanStack React Form
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Theme**: next-themes (Dark/Light Mode)
- **Notifications**: Sonner

#### **Database Schema**
The system uses a comprehensive PostgreSQL schema with:
- **Users**: Unified user model with role-based differentiation (Owner, Worker, Customer)
- **Requests**: Customer service requests with status tracking and priority management
- **Tasks**: Granular work units with skill requirements and time estimates
- **Inventory**: SKU-based inventory with reorder points and image URLs
- **Suppliers**: Supplier reliability tracking and order ETAs
- **Audit Logs**: Complete decision history with actor and reasoning

## 🚀 Getting Started

### Prerequisites

- **Bun**: v1.2.21 or higher ([Install Bun](https://bun.sh))
- **PostgreSQL**: v14 or higher
- **Node.js**: v20+ (for compatibility)
- **Supabase Account**: For storage and authentication services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harish-Naruto/CallOfCode_Operations-AI.git
   cd CallOfCode_Operations-AI
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**

   Create `.env` files in the appropriate directories:

   **`apps/server/.env`**
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   
   # CORS
   CORS_ORIGIN="http://localhost:3001"
   
   # Supabase
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   
   # Google AI
   GOOGLE_AI_API_KEY="your-google-ai-api-key"
   
   # Server
   PORT=3000
   ```

   **`apps/web/.env.local`**
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma Client
   bun run db:generate
   
   # Push schema to database
   bun run db:push
   
   # Seed initial data (optional)
   cd apps/server
   bun run seed
   ```

5. **Start Development Servers**
   ```bash
   # Start all services (server + web)
   bun run dev
   
   # Or start individually:
   bun run dev:server  # API server on http://localhost:3000
   bun run dev:web     # Web app on http://localhost:3001
   ```

## 📚 Project Structure

### Apps

#### **Server** (`apps/server/`)
```
src/
├── agent/              # LangGraph Agent Implementation
│   ├── graph/         # State graph and nodes
│   │   ├── nodes/     # Observer, Orient, Decide, Plan, Act, Respond
│   │   └── index.ts   # Graph builder and invocation helpers
│   ├── prompts/       # LLM prompts and state definitions
│   └── services/      # Agent-specific services
├── controllers/       # Request handlers
├── routes/            # API route definitions
│   ├── auth/         # Authentication routes
│   ├── customer/     # Customer-facing routes
│   ├── worker/       # Worker-facing routes
│   ├── owner/        # Owner dashboard routes
│   ├── inventory/    # Inventory management
│   └── internal/     # Agent internal routes
├── services/         # Business logic layer
├── middleware/       # Auth, error handling, idempotency
├── validation/       # Zod schemas
└── utils/            # Helper functions
```

#### **Web** (`apps/web/`)
```
src/
├── app/              # Next.js App Router
│   ├── auth/        # Login and signup pages
│   ├── customer/    # Customer dashboard
│   ├── worker/      # Worker dashboard
│   └── owner/       # Owner dashboard
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   └── [features]   # Feature-specific components
└── lib/             # Utilities and API clients
```

### Packages

#### **Database** (`packages/db/`)
- Prisma schema definition
- Database client configuration
- PostgreSQL adapter setup

#### **Config** (`packages/config/`)
- Shared TypeScript configurations
- Build tool settings

#### **Env** (`packages/env/`)
- Environment variable validation
- Type-safe env access

## 🛠️ Available Scripts

### Root Level
```bash
bun run dev              # Start all apps in development mode
bun run build            # Build all applications
bun run check-types      # TypeScript type checking across workspace

# Database operations
bun run db:push          # Push schema changes to database
bun run db:generate      # Generate Prisma Client
bun run db:migrate       # Run database migrations
bun run db:studio        # Open Prisma Studio GUI
```

### Server Specific
```bash
cd apps/server
bun run dev              # Start server in hot-reload mode
bun run build            # Build production server
bun run start            # Start production server
bun run seed             # Seed database with initial data
bun run compile          # Compile to standalone binary
```

### Web Specific
```bash
cd apps/web
bun run dev              # Start Next.js dev server
bun run build            # Build production bundle
bun run start            # Start production server
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Customer Routes
- `POST /api/requests` - Submit new service request
- `GET /api/requests/:id/status` - Get request status
- `POST /api/webhooks/whatsapp` - WhatsApp webhook handler

### Worker Routes
- `GET /api/tasks?assignedTo=me` - Get assigned tasks
- `POST /api/tasks/:id/accept` - Accept task assignment
- `POST /api/tasks/:id/update` - Update task progress
- `POST /api/tasks/:id/complete` - Mark task complete
- `POST /api/workers/:id/availability` - Update availability

### Owner Routes
- `GET /api/owner/requests` - List all requests
- `GET /api/owner/requests/:id` - Request details with audit trail
- `POST /api/owner/requests/:id/force-assign` - Manual override
- `PUT /api/owner/config/decision-rules` - Update agent decision weights
- `GET /api/owner/workers` - List all workers
- `GET /api/owner/audit` - Get audit logs

### Inventory Routes
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Create inventory item (with image upload)
- `PUT /api/inventory/:id` - Update inventory item
- `POST /api/inventory/update` - Adjust inventory quantity

### Internal Agent Routes (Protected)
- `POST /internal/agent/enqueue` - Queue agent job
- `POST /internal/agent/re-evaluate/:requestId` - Trigger reevaluation
- `POST /internal/agent/simulate` - Decision simulation (dry-run)

## 🤖 Agent Decision Flow

The LangGraph agent follows a structured decision-making process:

1. **OBSERVE** - Monitor inputs, detect changes, and gather raw data
2. **ORIENT** - Build decision-ready context from operational state
3. **DECIDE** - Use LLM to determine the best action based on:
   - Inventory availability
   - Worker skills and workload
   - Task dependencies
   - Customer priorities
   - Operational constraints
4. **PLAN TASKS** - Break down accepted requests into executable tasks
5. **ACT** - Execute decisions (assign tasks, update state, notify stakeholders)
6. **RESPOND** - Generate user-facing responses and notifications

### Decision Heuristics
The agent prioritizes:
1. Keeping customer commitments over starting new work
2. Reducing bottlenecks over maximizing throughput
3. Clear ownership over speed
4. Small reversible actions over large irreversible ones
5. Escalation over silent failure

## 🎨 Frontend Features

- **Modern UI/UX**: Dark mode support, glassmorphism effects, smooth animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Dynamic status tracking and notifications
- **Form Validation**: Client-side and server-side validation with Zod
- **Image Uploads**: Integrated with Supabase Storage for inventory images
- **Rich Components**: Built with shadcn/ui and Radix UI primitives

## 🔒 Security Features

- JWT-based authentication with secure HTTP-only cookies
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- CORS configuration for cross-origin requests
- Idempotency key support for safe retries
- Input validation with Zod schemas
- SQL injection protection via Prisma ORM

## 📊 Database Models

### Core Entities
- **User**: Unified user model with role differentiation
- **Customer**: Customer profile with contact details
- **Worker**: Worker profile with skills array
- **Owner**: Business owner profile
- **Request**: Service request with status tracking
- **Task**: Granular work units with assignments
- **InventoryItem**: Stock management with images
- **Supplier**: Supplier reliability tracking
- **SupplierOrder**: Purchase order management
- **AuditAction**: Complete decision audit trail

### Enums
- **UserRole**: `OWNER | WORKER | CUSTOMER`
- **RequestStatus**: `NEW | IN_PROGRESS | BLOCKED | DONE | CANCELLED`
- **TaskStatus**: `PENDING | ASSIGNED | IN_PROGRESS | BLOCKED | DONE`
- **AuditActor**: `AGENT | OWNER | WORKER | CUSTOMER | WEBHOOK`

## 🧪 Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement changes in appropriate workspace package
   - Run type checking: `bun run check-types`
   - Test locally with hot reload

2. **Database Changes**
   - Update `packages/db/prisma/schema/schema.prisma`
   - Generate client: `bun run db:generate`
   - Push changes: `bun run db:push`
   - Create migration (production): `bun run db:migrate`

3. **Testing**
   - Unit tests for services and utilities
   - Integration tests for API endpoints
   - Manual testing via Prisma Studio for database
   - Agent simulation endpoint for decision testing

## 🐳 Docker Support

The project includes Docker configuration for containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📖 Documentation References

- **[CLAUDE.md](./CLAUDE.md)** - System design principles and agent architecture
- **[API Specification](./Decision-centric%20Ai%20%E2%80%93%20Api%20%26%20System%20Interface%20Specification%20%28clothes%20Business%29%20%282%29.md)** - Complete API contract and interface definitions
- **[Prisma Schema](./packages/db/prisma/schema/schema.prisma)** - Database schema documentation

## 🎯 Use Case: Clothing MSME

The system is currently configured for a clothing business use case (tailoring, alterations, order fulfillment) with:

- **Request Types**: Alteration, Order, Stitching
- **Worker Skills**: Tailoring, delivery, quality check
- **Inventory**: Fabric SKUs with sizes, colors, measurements
- **Tasks**: Sleeve shortening, hemming, stitching, etc.

## 🤝 Contributing

This is a private project developed for MSME operational automation. For questions or contributions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Built with [LangGraph](https://github.com/langchain-ai/langgraph) for agentic AI workflows
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database management with [Prisma](https://www.prisma.io/)
- Monorepo tooling by [Turborepo](https://turbo.build/)
- Powered by [Bun](https://bun.sh) for blazing-fast JavaScript runtime

---

**Built with ❤️ for MSME empowerment through AI-driven operations**
