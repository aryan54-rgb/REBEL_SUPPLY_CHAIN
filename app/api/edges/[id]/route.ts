import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE /api/edges/[id] — Delete a graph edge
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const edge = await prisma.edge.delete({ where: { id } });

        return NextResponse.json({ success: true, data: edge });
    } catch (error) {
        console.error("[DELETE /api/edges/[id]]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to delete edge" },
            { status: 500 }
        );
    }
}
