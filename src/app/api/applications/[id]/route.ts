import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import LoanApplication from "@/models/LoanApplication";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // Try searching by _id first if it looks like a valid ObjectId
        let application = null;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            application = await LoanApplication.findById(id);
        }

        // If not found, try searching by applicantId
        if (!application) {
            application = await LoanApplication.findOne({ applicantId: id });
        }

        if (!application) {
            return NextResponse.json({
                message: "Application not found",
                success: false,
            }, { status: 404 });
        }

        return NextResponse.json({ application, success: true });
    } catch (error: any) {
        return NextResponse.json({
            message: "Failed to fetch application",
            error: error.message,
            success: false,
        }, { status: 500 });
    }
}
