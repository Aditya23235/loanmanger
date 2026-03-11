import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { fullName, email, phone, password } = await req.json();

        await connectToDatabase();

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                message: "Email already registered",
                success: false,
            }, { status: 400 });
        }

        // 2. Create the user record
        const newUser = await User.create({
            fullName,
            email,
            phone,
            password, // Note: In a real app, hash this before storing
            role: "customer"
        });

        return NextResponse.json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName
            },
            success: true,
        }, { status: 201 });
    } catch (error: any) {
        console.error("Signup failed:", error);
        return NextResponse.json({
            message: "An internal error occurred",
            error: error.message,
            success: false,
        }, { status: 500 });
    }
}
