import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateNodeInput } from "@/types";

// POST /api/nodes — Create a graph node
export async function POST(request: Request) {
    try {
        const body: CreateNodeInput = await request.json();
        const { id, name, type, tier, supplierId, lat, lon } = body;

        if (!id || !name || !type || tier === undefined) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: id, name, type, tier" },
                { status: 400 }
            );
        }

        const node = await prisma.node.create({
            data: {
                id,
                name,
                type,
                tier,
                supplierId: supplierId ?? null,
                lat: lat ?? 0,
                lon: lon ?? 0,
            },
        });

        return NextResponse.json({ success: true, data: node }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/nodes]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to create node" },
            { status: 500 }
        );
    }
}

// GET /api/nodes — Return all graph nodes
export async function GET() {
    try {
        const nodes = await prisma.node.findMany({
            orderBy: { tier: "asc" },
        });

        return NextResponse.json({ success: true, data: nodes });
    } catch (error) {
        console.error("[GET /api/nodes]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to fetch nodes" },
            { status: 500 }
        );
    }
}
