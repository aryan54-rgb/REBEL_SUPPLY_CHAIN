import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateSupplierInput } from "@/types";

// GET /api/suppliers/[id] — Return a single supplier
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const supplier = await prisma.supplier.findUnique({
            where: { id },
            include: {
                products: { include: { product: true } },
                createdByUser: { select: { id: true, email: true, role: true } },
            },
        });

        if (!supplier) {
            return NextResponse.json(
                { success: false, error: "Supplier not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: supplier });
    } catch (error) {
        console.error("[GET /api/suppliers/[id]]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to fetch supplier" },
            { status: 500 }
        );
    }
}

// PATCH /api/suppliers/[id] — Update a supplier
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body: UpdateSupplierInput = await request.json();

        const supplier = await prisma.supplier.update({
            where: { id },
            data: body,
            include: { products: { include: { product: true } } },
        });

        return NextResponse.json({ success: true, data: supplier });
    } catch (error) {
        console.error("[PATCH /api/suppliers/[id]]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to update supplier" },
            { status: 500 }
        );
    }
}

// DELETE /api/suppliers/[id] — Delete a supplier
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Delete related SupplierProduct entries first
        await prisma.supplierProduct.deleteMany({ where: { supplierId: id } });

        const supplier = await prisma.supplier.delete({ where: { id } });

        return NextResponse.json({ success: true, data: supplier });
    } catch (error) {
        console.error("[DELETE /api/suppliers/[id]]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to delete supplier" },
            { status: 500 }
        );
    }
}
