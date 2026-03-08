import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/auth/register — Register a new user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: email, password, role" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json(
                { success: false, error: "Email already registered" },
                { status: 409 }
            );
        }

        // NOTE: In production, hash the password with bcrypt.
        // For hackathon MVP, storing plain text.
        const user = await prisma.user.create({
            data: { email, password, role },
            select: { id: true, email: true, role: true, createdAt: true },
        });

        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/auth/register]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to register user" },
            { status: 500 }
        );
    }
}
