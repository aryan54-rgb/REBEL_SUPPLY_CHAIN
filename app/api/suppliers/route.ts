import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateSupplierInput } from "@/types";

// POST /api/suppliers — Create a new supplier
export async function POST(request: Request) {
    try {
        const body: CreateSupplierInput = await request.json();

        const { name, country, region, latitude, longitude, capacity, riskScore, costScore, createdByUserId } = body;

        if (!name || !country || !region || !createdByUserId) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: name, country, region, createdByUserId" },
                { status: 400 }
            );
        }

        const supplier = await prisma.supplier.create({
            data: {
                name,
                country,
                region,
                latitude: latitude ?? 0,
                longitude: longitude ?? 0,
                capacity: capacity ?? 0,
                riskScore: riskScore ?? 0,
                costScore: costScore ?? 0,
                createdByUserId,
            },
            include: { products: { include: { product: true } } },
        });

        return NextResponse.json({ success: true, data: supplier }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/suppliers]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to create supplier" },
            { status: 500 }
        );
    }
}

// GET /api/suppliers — Return all suppliers (optionally filtered by userId)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const where = userId ? { createdByUserId: userId } : {};

        const suppliers = await prisma.supplier.findMany({
            where,
            include: { products: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: suppliers });
    } catch (error) {
        console.error("[GET /api/suppliers]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to fetch suppliers" },
            { status: 500 }
        );
    }
}
