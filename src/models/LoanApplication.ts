import mongoose, { Schema, Document } from "mongoose";

export interface ILoanApplication extends Document {
    applicantId: string;
    fullName: string;
    aadhaarNumber: string;
    panNumber: string;
    employmentType: string;
    monthlyIncome: number;
    existingEmi: number;
    creditScore: number;
    loanAmountRequested: number;
    tenure: number;
    eligibleLoanAmount: number;
    riskScore: number;
    riskLevel: "Low" | "Medium" | "High";
    status: "Submitted" | "Under Review" | "Documents Pending" | "Risk Assessed" | "Approved" | "Rejected";
    createdAt: Date;
    updatedAt: Date;
}

const LoanApplicationSchema: Schema = new Schema(
    {
        applicantId: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        aadhaarNumber: { type: String, required: true },
        panNumber: { type: String, required: true },
        employmentType: {
            type: String,
            enum: ["Government", "Private", "Self-Employed"],
            required: true
        },
        monthlyIncome: { type: Number, required: true },
        existingEmi: { type: Number, default: 0 },
        creditScore: { type: Number, default: 0 },
        loanAmountRequested: { type: Number, required: true },
        tenure: { type: Number, required: true },
        eligibleLoanAmount: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["Submitted", "Under Review", "Documents Pending", "Risk Assessed", "Approved", "Rejected"],
            default: "Submitted"
        },
        userId: { type: String },
        userEmail: { type: String },
        riskScore: { type: Number, default: 0 },
        riskLevel: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low"
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.LoanApplication ||
    mongoose.model<ILoanApplication>("LoanApplication", LoanApplicationSchema);
