# Decision-Centric AI for MSME Operations

## API & Interface Specification (Clothes Business Use Case)

## 1. Overview

This document defines the **complete API contract** and **input/output
interfaces** for a Decision-Centric AI system designed for a **clothing
MSME** (tailoring, alterations, order fulfillment).

The system supports **three dashboards**: - **Customer Dashboard** (and
WhatsApp input) - **Worker Dashboard** (tailors, delivery staff) -
**Owner Dashboard** (operations & decision oversight)

The core principle is that **all operational decisions are made by the
AgentFlow**, not by users or APIs.

## 2. Architecture Context

    Client (Customer / Worker / Owner)
            ↓
          Server (API + Validation + Auth)
            ↓
    Database (Supabase Postgres)
            ↓
    AgentFlow (Promise Validator + Bottleneck Detector)
            ↓
    Database + Audit + Notifications

## 3. Common Conventions

### 3.1 Authentication

  -----------------------------------------------------------------------
  Role                                Auth Method
  ----------------------------------- -----------------------------------
  Customer                            OTP / Token (optional for WhatsApp)

  Worker                              JWT / Supabase Auth

  Owner                               JWT / Supabase Auth (admin role)

  Agent                               Internal API key / DB jobs
  -----------------------------------------------------------------------

### 3.2 Common Headers

    Authorization: Bearer <token>
    Idempotency-Key: <uuid>
    Content-Type: application/json

### 3.3 Core Status Values

-   Request: `new | in_progress | blocked | done | cancelled`
-   Task: `pending | assigned | in_progress | blocked | done`

## 4. Data Schemas (Core)

### 4.1 Normalized Request Payload (Clothes Business)

    {
      "type": "alteration | order | stitching",
      "items": [
        {
          "sku": "SH-001",
          "qty": 1,
          "size": "M",
          "color": "Blue",
          "fabric": "Cotton",
          "alteration_type": "sleeve_shortening",
          "measurement": { "sleeve_cm": 60 }
        }
      ],
      "required_skills": ["tailoring"],
      "estimated_minutes": 90,
      "preferred_slot": {
        "start": "2026-02-03T09:00:00Z",
        "end": "2026-02-03T12:00:00Z"
      },
      "notes": "Shorten sleeves by 3 cm"
    }

## 5. CUSTOMER INTERFACES

### 5.1 WhatsApp Webhook (Customer Input)

**POST** `/api/webhooks/whatsapp`

**Auth:** Provider signature

**Request (raw):**

    {
      "message_id": "SM123",
      "from": "+9198xxxx",
      "text": "Alter shirt SH-001 size M, sleeves shorter"
    }

**Behavior:** - Parse message → normalized payload - Insert into
`requests` with `status=new` - Trigger AgentFlow

**Response:**

    200 OK

### 5.2 Customer Web Request

**POST** `/api/requests`

**Auth:** Optional (customer token)

**Request:** Normalized payload (see 4.1)

**Response:**

    { "requestId": "req_123" }

### 5.3 Customer Request Status

**GET** `/api/requests/{requestId}/status`

**Response:**

    {
      "requestId": "req_123",
      "status": "in_progress",
      "eta": "2026-02-03T10:30:00Z",
      "assigned_worker": {
        "id": "u_12",
        "name": "Rahul"
      }
    }

## 6. WORKER DASHBOARD INTERFACES

### 6.1 Get Assigned Tasks

**GET** `/api/tasks?assignedTo=me`

**Auth:** Worker

**Response:**

    [
      {
        "taskId": "task_1",
        "requestId": "req_123",
        "title": "Alter shirt",
        "estimated_minutes": 90,
        "status": "assigned"
      }
    ]

### 6.2 Accept Task

**POST** `/api/tasks/{taskId}/accept`

**Auth:** Worker

**Response:**

    { "success": true }

### 6.3 Update Task Progress

**POST** `/api/tasks/{taskId}/update`

**Request:**

    {
      "actual_minutes_so_far": 30,
      "notes": "Working on sleeves"
    }

### 6.4 Complete Task

**POST** `/api/tasks/{taskId}/complete`

**Request:**

    {
      "actual_minutes": 85,
      "quality_ok": true,
      "notes": "Completed alteration"
    }

**Side Effects:** - Marks task as `done` - Updates request status -
Triggers AgentFlow follow-up

### 6.5 Worker Availability

**POST** `/api/workers/{workerId}/availability`

**Request:**

    {
      "shifts": [
        { "start": "2026-02-03T09:00:00Z", "end": "2026-02-03T17:00:00Z" }
      ]
    }

## 7. OWNER DASHBOARD INTERFACES

### 7.1 List Requests

**GET** `/api/owner/requests?status=in_progress`

### 7.2 Request Detail + Audit

**GET** `/api/owner/requests/{requestId}`

**Response includes:** - Request - Tasks - Audit actions - Decision
breakdown

### 7.3 Force Assign (Override)

**POST** `/api/owner/requests/{requestId}/force-assign`

**Request:**

    {
      "workerId": "u_15",
      "reason": "Manual override"
    }

### 7.4 Decision Rule Configuration

**PUT** `/api/owner/config/decision-rules`

**Request:**

    {
      "weights": { "inventory": 0.45, "staff": 0.4, "dependency": 0.15 },
      "thresholds": { "promise": 0.8 }
    }

## 8. INVENTORY & SUPPLIERS

### 8.1 Update Inventory

**POST** `/api/inventory/update`

**Request:**

    { "sku": "SH-001", "delta": -1, "source": "pickup" }

### 8.2 Supplier Webhook

**POST** `/api/webhooks/supplier`

**Request:**

    { "orderRef": "SUP-22", "eta": "2026-02-05T10:00:00Z" }

## 9. AGENTFLOW (INTERNAL)

### 9.1 Enqueue Agent Job

**POST** `/internal/agent/enqueue`

    { "type": "handle_request", "requestId": "req_123" }

### 9.2 Re-evaluate Request

**POST** `/internal/agent/re-evaluate/{requestId}`

### 9.3 Agent Simulation (No Side Effects)

**POST** `/internal/agent/simulate`

**Request:** snapshot JSON

## 10. AUDIT & OBSERVABILITY

### 10.1 Audit Logs

**GET** `/api/owner/audit?requestId=req_123`

## 11. Key Guarantees

-   All assignments are **agent-owned**
-   Every decision writes an **audit record**
-   APIs are **idempotent** and **transaction-safe**
-   UI reflects **agent reasoning**, not manual logic

## 12. MVP Acceptance Criteria

-   WhatsApp / Web request creates request
-   Agent validates promise & assigns task
-   Worker completes task
-   Owner sees full decision trace

## END OF DOCUMENT
