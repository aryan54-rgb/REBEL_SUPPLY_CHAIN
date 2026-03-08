import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Run a simple query to fetch records from the User table
        const users = await prisma.user.findMany();

        return NextResponse.json(users);
    } catch (error) {
        console.error("Prisma verification error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch users from database",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
