
import prisma from "@Hackron/db";

async function checkState() {
    console.log("Checking DB State...");

    const requests = await prisma.request.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${requests.length} recent requests.`);

    const tasks = await prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${tasks.length} recent tasks.`);

    const unassigned = await prisma.task.findMany({
        where: {
            OR: [
                { status: "PENDING", workerId: null },
                { status: "BLOCKED" }
            ]
        }
    });
    console.log(`Found ${unassigned.length} unassigned/blocked tasks.`);

    if (unassigned.length > 0) {
        console.log("Sample unassigned task:", unassigned[0]);
    }
}

checkState()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
