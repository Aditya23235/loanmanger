"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RiskBadge } from "@/components/RiskBadge";
import { toast } from "sonner";
import { format, addMonths } from "date-fns";
import { exportToExcel } from "@/lib/excel-utils";
import {
    CheckCircle2,
    IndianRupee,
    ShieldCheck,
    TrendingUp,
    ArrowRight,
    FileDown
} from "lucide-react";
import { AboutLoans } from "@/components/AboutLoans";
import { Footer } from "@/components/Footer";
import type { RiskLevel } from "@/lib/mock-data";

const loanSchema = z.object({
    fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
    panNumber: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, "PAN format: ABCDE1234F"),
    employmentType: z.enum(["Government", "Private", "Self-Employed"]),
    monthlyIncome: z.coerce.number().min(10000, "Minimum ₹10,000"),
    loanAmountRequested: z.coerce.number().min(50000, "Minimum ₹50,000"),
    tenure: z.coerce.number().min(6, "Minimum 6 months").max(360, "Maximum 360 months"),
});

type LoanFormValues = z.infer<typeof loanSchema>;

interface EligibilityResult {
    eligibleAmount: number;
    riskScore: number;
    riskLevel: RiskLevel;
}

function calculateEligibility(data: LoanFormValues): EligibilityResult {
    const disposableIncome = data.monthlyIncome;
    const maxEmi = disposableIncome * 0.5;
    const eligibleAmount = Math.min(maxEmi * data.tenure * 0.85, data.loanAmountRequested);

    let riskScore = 15; // Starting with a base middle-ground risk

    if (data.employmentType === "Self-Employed") riskScore += 15;
    else if (data.employmentType === "Private") riskScore += 5;

    const riskLevel: RiskLevel = riskScore <= 30 ? "Low" : riskScore <= 60 ? "Medium" : "High";

    return {
        eligibleAmount: Math.max(0, Math.round(eligibleAmount)),
        riskScore: Math.min(100, riskScore),
        riskLevel,
    };
}

export default function Page() {
    const router = useRouter();
    const [result, setResult] = useState<EligibilityResult | null>(null);

    const exportSchedule = () => {
        if (!result) return;
        const data = form.getValues();
        const schedule = [];
        let balance = result.eligibleAmount;

        const annualRate = 10.5;
        const r = annualRate / 12 / 100;
        const n = data.tenure;

        // Calculate monthly installment (EMI) with precision
        const emiRaw = balance * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const startDate = new Date();

        let totalInterest = 0;
        let totalPrincipal = 0;
        let totalEMI = 0;

        for (let i = 1; i <= n; i++) {
            const interest = balance * r;
            const principal = emiRaw - interest;
            const currentBalance = balance;

            totalInterest += interest;
            totalPrincipal += principal;
            totalEMI += emiRaw;

            balance -= principal;

            schedule.push({
                "SR.NO": i,
                "PERIOD": i,
                "PAY DATE": format(addMonths(startDate, i), "dd/MM/yyyy"),
                "EMI AMOUNT": emiRaw.toFixed(2),
                "CURRENT_BALANCE": Math.max(0, currentBalance).toFixed(2),
                "INTEREST": interest.toFixed(2),
                "PRINCIPAL": principal.toFixed(2)
            });
        }

        // Add Total row
        schedule.push({
            "SR.NO": "",
            "PERIOD": "Total",
            "PAY DATE": "",
            "EMI AMOUNT": totalEMI.toFixed(2),
            "CURRENT_BALANCE": "",
            "INTEREST": totalInterest.toFixed(2),
            "PRINCIPAL": totalPrincipal.toFixed(2)
        });

        const safeName = (data.fullName || "Applicant").replace(/\s+/g, '_');
        exportToExcel(schedule, `Repayment_Schedule_${safeName}`, "Schedule");
    };

    const form = useForm<LoanFormValues>({
        resolver: zodResolver(loanSchema),
        defaultValues: {
            fullName: "",
            aadhaarNumber: "",
            panNumber: "",
            employmentType: undefined,
            monthlyIncome: undefined,
            loanAmountRequested: undefined,
            tenure: undefined,
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit = async (data: LoanFormValues) => {
        // 1. Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            toast.error("Please Sign In First", {
                description: "You must be logged in to submit a loan application. If you don't have an account, you can sign up on the login page.",
            });
            router.push("/login");
            return;
        }

        setIsSubmitting(true);
        // still calculate eligibility locally for fast feedback
        setResult(calculateEligibility(data));

        try {
            const user = JSON.parse(storedUser);
            const assessment = calculateEligibility(data);
            const submissionData = {
                ...data,
                userId: user.id || user._id, // Support both id formats
                userEmail: user.email,
                riskScore: assessment.riskScore,
                riskLevel: assessment.riskLevel
            };

            const response = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                const resultData = await response.json();
                const appId = resultData.application.applicantId;

                toast.success("Application Submitted Successfully", {
                    description: `Your Applicant ID is ${appId}. Please save this to track your status.`,
                    duration: 10000,
                });
                form.reset();
            } else {
                toast.error("Submission failed", {
                    description: "Please check your network and try again.",
                });
            }
        } catch (error) {
            toast.error("Application submission failed", {
                description: "Something went wrong while connecting to the database.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
            {/* Hero Section */}
            <div className="mb-16 text-center animate-fade-in">
                <h1 className="mb-6 font-display text-5xl font-bold tracking-tight md:text-6xl text-slate-900">
                    Apply for your <span className="text-gradient">Dream Loan</span> today.
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-600">
                    Fill in your details below and get an instant eligibility assessment. Our advanced scoring system helps you know where you stand in seconds.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr,350px]">
                <div className="animate-slide-in">
                    <Card className="glass overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-primary/5">
                        <CardHeader className="bg-primary/5 border-b border-primary/10">
                            <CardTitle className="font-display text-2xl font-bold">Loan Application Form</CardTitle>
                            <CardDescription className="text-base">Complete all sections for an accurate risk assessment.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
                                    <FormField control={form.control} name="fullName" render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Full Name</FormLabel>
                                            <FormControl><Input className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-white transition-all" placeholder="Enter your full name" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="aadhaarNumber" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Aadhaar Number</FormLabel>
                                            <FormControl><Input className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-white transition-all" placeholder="12 digit number" maxLength={12} {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="panNumber" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">PAN Number</FormLabel>
                                            <FormControl><Input className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-white transition-all" placeholder="ABCDE1234F" maxLength={10} {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="employmentType" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Employment Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-white transition-all"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Government">Government</SelectItem>
                                                    <SelectItem value="Private">Private</SelectItem>
                                                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Monthly Income (₹)</FormLabel>
                                            <FormControl><Input type="number" className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-white transition-all" placeholder="85000" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />


                                    <FormField control={form.control} name="loanAmountRequested" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Loan Amount Requested (₹)</FormLabel>
                                            <FormControl><Input type="number" className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-white transition-all" placeholder="1000000" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="tenure" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Tenure (months)</FormLabel>
                                            <FormControl><Input type="number" className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-white transition-all" placeholder="12-360" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="sm:col-span-2 pt-4">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={isSubmitting}
                                            className="w-full h-14 bg-gradient-to-r from-primary to-accent text-white text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>Submitting... <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /></>
                                            ) : (
                                                <>Submit <ArrowRight className="h-5 w-5" /></>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {result ? (
                        <Card className="glass animate-fade-in border-accent/30 overflow-hidden shadow-2xl">
                            <CardHeader className="bg-accent/10 border-b border-accent/20">
                                <CardTitle className="font-display flex items-center gap-2 text-accent">
                                    <CheckCircle2 className="h-6 w-6" />
                                    Assessment Result
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/70">Eligible Amount</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-lg">
                                            <IndianRupee className="h-6 w-6" />
                                        </div>
                                        <p className="font-display text-2xl font-black">₹{result.eligibleAmount.toLocaleString("en-IN")}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/70">Risk Assessment</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-display text-2xl font-black">{result.riskScore}/100</p>
                                            <div className="mt-1"><RiskBadge level={result.riskLevel} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-muted-foreground/10 space-y-4">
                                    <Button
                                        onClick={exportSchedule}
                                        className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                    >
                                        <FileDown className="h-4 w-4" /> Export Schedule
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground">Estimate based on 10.5% interest rate. Actual terms may vary.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="glass p-8 rounded-3xl border-white/20 text-center space-y-4 animate-pulse">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                <ShieldCheck className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="font-display text-xl font-bold">Secure Assessment</h3>
                            <p className="text-sm text-muted-foreground">Your data is encrypted and used only for eligibility calculation.</p>
                        </div>
                    )}

                    {/* Feature Highlight */}
                    <Card className="bg-gradient-to-br from-primary to-accent border-none text-white overflow-hidden p-6 shadow-2xl">
                        <h3 className="font-display text-xl font-bold mb-2">Why LoanFlow?</h3>
                        <ul className="space-y-3 text-sm opacity-90">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                Instant approval status
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                Transparent risk profiling
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                Lowest interest rates in class
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>

            <AboutLoans />
            <Footer />
        </div>
    );
}
