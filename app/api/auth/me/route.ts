// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the token from cookies
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        id: Number(decoded.id),
      },
      select: {
        id: true,
        email: true,
        // Add other non-sensitive fields you want to return
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  } finally {
    await prisma.$disconnect();
  }
}