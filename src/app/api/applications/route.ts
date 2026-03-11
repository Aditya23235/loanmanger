import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import LoanApplication from "@/models/LoanApplication";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // 1. Connect to MongoDB
        await connectToDatabase();

        // 2. Generate a unique Applicant ID
        const year = new Date().getFullYear();
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const applicantId = `LF-${year}-${randomDigits}`;

        // 3. Create the loan application in the database
        const application = await LoanApplication.create({
            ...data,
            applicantId,
        });

        return NextResponse.json({
            message: "Application submitted successfully",
            application,
            success: true,
        }, { status: 201 });
    } catch (error: any) {
        console.error("Database connection or submission failed:", error);
        return NextResponse.json({
            message: "Submission failed",
            error: error.message,
            success: false,
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const applications = await LoanApplication.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ applications, success: true });
    } catch (error: any) {
        return NextResponse.json({
            message: "Failed to fetch applications",
            error: error.message,
            success: false,
        }, { status: 500 });
    }
}
