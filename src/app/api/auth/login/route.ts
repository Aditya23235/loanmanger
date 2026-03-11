import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        await connectToDatabase();

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                message: "Invalid email or password",
                success: false,
            }, { status: 401 });
        }

        // 2. Check password (in real app, use bcrypt.compare)
        if (user.password !== password) {
            return NextResponse.json({
                message: "Invalid email or password",
                success: false,
            }, { status: 401 });
        }

        // 3. Success - in a real app, you would set a session/cookie here
        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            },
            success: true,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Login failed:", error);
        return NextResponse.json({
            message: "An internal error occurred",
            error: error.message,
            success: false,
        }, { status: 500 });
    }
}
