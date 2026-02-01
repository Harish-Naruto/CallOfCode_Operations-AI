
import prisma from "@Hackron/db";
import { RequestStatus, TaskStatus } from "../types/types";

async function seedManualTask() {
    console.log("Seeding Manual Task...");

    // 1. Create a dummy Customer (or find one)
    let customer = await prisma.customer.findFirst();
    if (!customer) {
        customer = await prisma.customer.create({
            data: {
                email: "test_customer@example.com",
                name: "Test Customer",
                phone: "555-0101"
            }
        });
        console.log("Created test customer");
    }

    // 2. Create a Request
    const request = await prisma.request.create({
        data: {
            customerId: customer.id,
            status: RequestStatus.IN_PROGRESS,
            source: "script",
            priority: 10,
            payload: {
                type: "alteration",
                items: [{ sku: "TEST-SKU", qty: 1 }],
                required_skills: ["sewing"],
                estimated_minutes: 60
            },
            payloadRaw: {}
        }
    });
    console.log(`Created Request: ${request.id}`);

    // 3. Create a BLOCKED/Unassigned Task
    const task = await prisma.task.create({
        data: {
            requestId: request.id,
            title: "Manual Intervention Required: Complex Alteration",
            status: TaskStatus.BLOCKED, // or PENDING with null workerId
            workerId: null,
            estimatedMin: 60,
            requiredSkills: ["sewing", "embroidery"]
        }
    });

    console.log(`Created Unassigned Task: ${task.id}`);
    console.log("Done. Refresh the Owner Dashboard.");
}

seedManualTask()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
