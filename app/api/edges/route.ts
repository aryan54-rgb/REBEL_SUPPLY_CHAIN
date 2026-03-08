import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateEdgeInput } from "@/types";

// POST /api/edges — Create a graph edge (connection)
export async function POST(request: Request) {
    try {
        const body: CreateEdgeInput = await request.json();
        const { source, target } = body;

        if (!source || !target) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: source, target" },
                { status: 400 }
            );
        }

        // Prevent duplicate edges
        const existing = await prisma.edge.findFirst({
            where: { source, target },
        });

        if (existing) {
            return NextResponse.json(
                { success: false, error: "Edge already exists between these nodes" },
                { status: 409 }
            );
        }

        const edge = await prisma.edge.create({
            data: { source, target },
        });

        return NextResponse.json({ success: true, data: edge }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/edges]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to create edge" },
            { status: 500 }
        );
    }
}

// GET /api/edges — Return all graph edges
export async function GET() {
    try {
        const edges = await prisma.edge.findMany();

        return NextResponse.json({ success: true, data: edges });
    } catch (error) {
        console.error("[GET /api/edges]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to fetch edges" },
            { status: 500 }
        );
    }
}
