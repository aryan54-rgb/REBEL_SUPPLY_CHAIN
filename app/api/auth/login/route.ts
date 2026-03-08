import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/auth/login — Login a user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: email, password" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Return user data (without password)
        // NOTE: In production, generate a JWT token here
        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("[POST /api/auth/login]", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Failed to login" },
            { status: 500 }
        );
    }
}
