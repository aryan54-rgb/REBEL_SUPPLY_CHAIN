import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateDisruptionInput } from "@/types";

// POST /api/disruptions — Simulate a supply chain disruption
export async function POST(request: Request) {
    try {
        const body: CreateDisruptionInput = await request.json();
        const { supplierId } = body;

        if (!supplierId) {
            return NextResponse.json(
                { success: false, error: "Missing required field: supplierId" },
                { status: 400 }
            );
        }

        const disruption = await prisma.disruption.create({
            data: { supplierId },
        });

        return NextResponse.json({ success: true, data: disruption }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/disruptions]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to create disruption" },
            { status: 500 }
        );
    }
}

// GET /api/disruptions — Return all disruptions
export async function GET() {
    try {
        const disruptions = await prisma.disruption.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: disruptions });
    } catch (error) {
        console.error("[GET /api/disruptions]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to fetch disruptions" },
            { status: 500 }
        );
    }
}
