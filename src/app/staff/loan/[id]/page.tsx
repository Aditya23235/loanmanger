"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, CheckCircle2, FileText, RefreshCw, XCircle, User, Briefcase, TrendingUp, ShieldCheck, Loader2 } from "lucide-react";
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
                <p className="text-xl font-bold text-muted-foreground">Application not found</p>
                <Button asChild variant="outline" className="mt-6 rounded-xl">
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
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 rounded-xl border-destructive/20 text-destructive font-bold hover:bg-destructive/10" onClick={() => toast.error("Application rejected")}>
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button className="h-12 rounded-xl bg-success px-8 font-bold text-white shadow-xl shadow-success/20 hover:scale-105 transition-all" onClick={() => toast.success("Application approved")}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Case
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Personal Details */}
                <Card className="glass border-white/20 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                        <CardTitle className="font-display text-xl font-bold flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" /> Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <DetailRow label="Full Name" value={app.fullName} />
                        <DetailRow label="Aadhaar ID" value={app.aadhaarNumber.replace(/(\d{4})/g, "$1 ").trim()} />
                        <DetailRow label="PAN Number" value={app.panNumber} />
                        <DetailRow label="Employment" value={app.employmentType} />
                    </CardContent>
                </Card>

                {/* Financial Details */}
                <Card className="glass border-white/20 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-accent/5 border-b border-accent/10">
                        <CardTitle className="font-display text-xl font-bold flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-accent" /> Financial Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <DetailRow label="Monthly Income" value={`₹${app.monthlyIncome.toLocaleString("en-IN")}`} />
                        <DetailRow label="Existing EMI" value={`₹${app.existingEmi.toLocaleString("en-IN")}`} />
                        <DetailRow label="Credit Score" value={String(app.creditScore)} isEmphasis />
                        <DetailRow label="Loan Request" value={`₹${app.loanAmountRequested.toLocaleString("en-IN")}`} isEmphasis />
                        <DetailRow label="Tenure" value={`${app.tenure} months`} />
                    </CardContent>
                </Card>

                {/* Risk Discovery */}
                <Card className="glass border-white/20 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-amber-500/5 border-b border-amber-500/10">
                        <CardTitle className="font-display text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-amber-500" /> Risk Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        <DetailRow label="Eligible Amount" value={`₹${app.eligibleLoanAmount.toLocaleString("en-IN")}`} />
                        <DetailRow label="Risk Score" value={`${app.riskScore}/100`} />
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">Calculated Risk</span>
                            <RiskBadge level={app.riskLevel} />
                        </div>
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
