"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, FileText, RefreshCw, User, Briefcase, TrendingUp, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";

export default function LoanDetails() {
    const params = useParams();
    const id = params?.id as string;
    const [app, setApp] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchApp() {
            try {
                const res = await fetch(`/api/applications/${id}`);
                const data = await res.json();
                if (data.success) {
                    setApp(data.application);
                }
            } catch (error) {
                console.error("Failed to fetch application", error);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchApp();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="font-bold">Loading Case Details...</span>
            </div>
        );
    }

    if (!app) {
        return (
            <div className="container py-20 text-center animate-fade-in">
                <p className="text-xl font-bold text-muted-foreground">Application not found (Searching ID: {id})</p>
                <div className="mt-2 text-sm text-muted-foreground italic">Check if the ID in the URL matches a record in your database.</div>
                <Button asChild variant="outline" className="mt-8 rounded-xl">
                    <Link href="/staff"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 animate-fade-in">
            <Button asChild variant="ghost" className="mb-10 rounded-xl hover:bg-white/50">
                <Link href="/staff" className="flex items-center gap-2 font-bold text-muted-foreground hover:text-primary transition-all">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>

            <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">{app.fullName}</h1>
                        <StatusBadge status={app.status} />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground">
                        Application: {app.applicantId} · Submitted {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                </div>

            </div>

            {/* Case Overview Summary */}
            <Card className="mb-10 glass border-primary/20 shadow-xl overflow-hidden">
                <CardHeader className="bg-primary/5 p-6 border-b border-primary/10">
                    <CardTitle className="font-display text-xl font-bold flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5" /> Case Overview Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <p className="text-lg leading-relaxed text-slate-700 font-medium">
                        Applicant <span className="text-primary font-bold">{app.fullName}</span>, a <span className="font-bold">{app.employmentType}</span> professional with a monthly income of <span className="font-bold text-slate-900">₹{app.monthlyIncome?.toLocaleString("en-IN")}</span>, has submitted a request for a <span className="font-bold text-slate-900">₹{app.loanAmountRequested?.toLocaleString("en-IN")}</span> loan over a tenure of <span className="font-bold">{app.tenure} months</span>. The system has calculated an eligibility amount of <span className="font-bold text-primary">₹{app.eligibleLoanAmount?.toLocaleString("en-IN")}</span> based on the provided financial profile.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                {/* FULL APPLICANT PROFILE */}
                <Card className="glass border-white/20 shadow-2xl overflow-hidden md:col-span-2">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                        <CardTitle className="font-display text-2xl font-black flex items-center gap-3">
                            <User className="h-6 w-6 text-primary" /> FULL APPLICANT PROFILE
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid gap-x-12 gap-y-6 sm:grid-cols-2">
                        <DetailRow label="Full Name" value={app.fullName} />
                        <DetailRow label="Aadhaar Number" value={app.aadhaarNumber.replace(/(\d{4})/g, "$1 ").trim()} />
                        <DetailRow label="PAN Number" value={app.panNumber} />
                        <DetailRow label="Employment Type" value={app.employmentType} />
                        <DetailRow label="Monthly Income (₹)" value={`₹${app.monthlyIncome?.toLocaleString("en-IN")}`} />
                        <DetailRow label="Loan Amount Requested (₹)" value={`₹${app.loanAmountRequested?.toLocaleString("en-IN")}`} isEmphasis />
                        <DetailRow label="Tenure (months)" value={`${app.tenure} months`} />
                        <DetailRow label="Eligible Amount (₹)" value={`₹${app.eligibleLoanAmount?.toLocaleString("en-IN")}`} isEmphasis />
                    </CardContent>
                </Card>

                {/* Additional Information */}
                <Card className="glass border-white/20 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-accent/5 border-b border-accent/10">
                        <CardTitle className="font-display text-xl font-bold flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-accent" /> Financial & Risk Context
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <DetailRow label="Existing EMI" value={`₹${app.existingEmi?.toLocaleString("en-IN")}`} />
                        <DetailRow label="Credit Score" value={String(app.creditScore)} isEmphasis />
                        <DetailRow label="Risk Score" value={`${app.riskScore}/100`} />
                    </CardContent>
                </Card>



                {/* Documents */}
                <Card className="glass border-white/20 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-muted/50 border-b border-white/10">
                        <CardTitle className="font-display text-xl font-bold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" /> Verified Documents
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        {app.documents && app.documents.length > 0 ? (
                            app.documents.map((doc: any) => (
                                <div key={doc.name} className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/40 p-4 transition-all hover:bg-white/60">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/80 shadow-sm text-primary">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold">{doc.name}</span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                                            doc.status === "Verified"
                                                ? "bg-success/10 text-success border-success/20"
                                                : doc.status === "Uploaded"
                                                    ? "bg-info/10 text-info border-info/20"
                                                    : "bg-warning/10 text-warning border-warning/20"
                                        )}
                                    >
                                        {doc.status}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-muted-foreground italic font-medium">
                                No documents uploaded yet.
                            </div>
                        )}
                        <Button variant="ghost" className="w-full h-12 rounded-xl border border-dashed border-muted-foreground/20 font-bold text-muted-foreground hover:bg-white/40" onClick={() => toast.info("Re-upload requested")}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Request Document Re-upload
                        </Button>
                    </CardContent>
                </Card>

                {/* Application Metadata */}
                <Card className="glass border-white/20 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-slate-500/5 border-b border-slate-500/10">
                        <CardTitle className="font-display text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-slate-500" /> Application Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <DetailRow label="System Email" value={app.userEmail || "Not Provided"} />
                        <DetailRow label="Internal UID" value={app.userId?.slice(-12) || "N/A"} />
                        <DetailRow label="Last Updated" value={new Date(app.updatedAt).toLocaleString()} />
                        <DetailRow label="Submission" value={new Date(app.createdAt).toLocaleString()} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DetailRow({ label, value, isEmphasis }: { label: string; value: string; isEmphasis?: boolean }) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">{label}</span>
            <span className={cn("font-display font-bold tabular-nums", isEmphasis ? "text-lg text-primary" : "text-base")}>{value}</span>
        </div>
    );
}
