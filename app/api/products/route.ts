import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateProductInput } from "@/types";

// POST /api/products — Create a product (optionally link to suppliers)
export async function POST(request: Request) {
    try {
        const body: CreateProductInput = await request.json();
        const { name, supplierIds } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: "Missing required field: name" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                suppliers: supplierIds?.length
                    ? {
                        create: supplierIds.map((sid) => ({
                            supplier: { connect: { id: sid } },
                        })),
                    }
                    : undefined,
            },
            include: { suppliers: { include: { supplier: true } } },
        });

        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/products]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to create product" },
            { status: 500 }
        );
    }
}

// GET /api/products — Return all products
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: { suppliers: { include: { supplier: true } } },
        });

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error("[GET /api/products]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to fetch products" },
            { status: 500 }
        );
    }
}
