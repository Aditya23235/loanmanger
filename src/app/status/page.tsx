"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockApplications, statusSteps, type ApplicationStatus } from "@/lib/mock-data";
import { Check, Circle, Search, ArrowRight, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatusTracking() {
    const [applicationId, setApplicationId] = useState("");
    const [application, setApplication] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!applicationId.trim()) return;

        setIsLoading(true);
        setError(null);
        setApplication(null);

        try {
            const response = await fetch(`/api/applications/${applicationId.trim()}`);
            const data = await response.json();

            if (response.ok && data.success) {
                setApplication(data.application);
            } else {
                setError(data.message || "Application not found");
            }
        } catch (err) {
            setError("Something went wrong while fetching the application");
        } finally {
            setIsLoading(false);
        }
    };

    const getStepIndex = (status: ApplicationStatus) => {
        if (status === "Rejected") return statusSteps.indexOf("Risk Assessed");
        return statusSteps.indexOf(status);
    };

    const currentStep = application ? getStepIndex(application.status) : -1;

    return (
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 animate-fade-in">
            {/* Header Section */}
            <div className="mb-12 text-center">
                <h1 className="mb-4 font-display text-4xl font-bold tracking-tight md:text-5xl text-slate-900">
                    Track your <span className="text-gradient">Application Status</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-600">
                    Enter your unique application ID to see real-time updates on your loan process.
                </p>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mb-12 flex max-w-xl gap-3">
                <div className="relative flex-1">
                    <ClipboardList className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                        placeholder="e.g. LF-2025-1234"
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="h-14 pl-12 bg-white/70 backdrop-blur-md border-primary/20 focus:ring-primary/20 text-lg font-medium shadow-lg"
                    />
                </div>
                <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="h-14 px-8 bg-primary text-white text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    {isLoading ? "Searching..." : <><Search className="mr-2 h-5 w-5" /> Search</>}
                </Button>
            </div>

            {application ? (
                <div className="animate-slide-in">
                    <Card className="glass overflow-hidden shadow-2xl border-white/20">
                        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/10 p-8">
                            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Application Overview</p>
                                    <CardTitle className="font-display text-3xl font-bold">{application.fullName}</CardTitle>
                                    <CardDescription className="text-sm font-medium">
                                        ID: {application.applicantId} · Submitted on {new Date(application.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <StatusBadge status={application.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 md:p-12">
                            <div className="relative space-y-0">
                                {/* Horizontal progress line for larger screens, vertical for smaller */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted md:left-0 md:right-0 md:top-6 md:h-0.5 md:w-full" />

                                <div className="grid gap-12 md:grid-cols-6 md:gap-4">
                                    {statusSteps.map((step, i) => {
                                        const isCompleted = i <= currentStep;
                                        const isCurrent = i === currentStep;
                                        const isRejected = application.status === "Rejected" && step === "Approved";

                                        return (
                                            <div key={step} className="relative flex flex-row items-center gap-6 md:flex-col md:text-center md:gap-4">
                                                <div
                                                    className={cn(
                                                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 transition-all duration-500 md:h-12 md:w-12",
                                                        isRejected
                                                            ? "border-destructive/20 bg-destructive text-white scale-110 shadow-lg shadow-destructive/20"
                                                            : isCompleted
                                                                ? "border-primary/20 bg-primary text-white scale-110 shadow-lg shadow-primary/20"
                                                                : "border-muted bg-white text-muted-foreground"
                                                    )}
                                                >
                                                    {isRejected ? (
                                                        <span className="text-sm font-bold">✕</span>
                                                    ) : isCompleted ? (
                                                        <Check className="h-5 w-5" />
                                                    ) : (
                                                        <span className="text-xs font-semibold">{i + 1}</span>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className={cn(
                                                        "text-sm font-bold tracking-tight md:text-xs md:uppercase",
                                                        isCurrent && "text-primary",
                                                        isRejected && "text-destructive",
                                                        !isCompleted && "text-muted-foreground"
                                                    )}>
                                                        {isRejected ? "Rejected" : step}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-medium">
                                                        {isCompleted ? (isCurrent ? "Active" : "Done") : "Pending"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Suggestion */}
                            <div className="mt-16 rounded-3xl bg-muted/40 p-8 border border-white/20 text-center">
                                <h3 className="font-display text-lg font-bold mb-2">Need help with your application?</h3>
                                <p className="text-sm text-muted-foreground mb-6">Our support team is available 24/7 to assist you with any questions.</p>
                                <Button variant="outline" className="rounded-xl px-8 h-12 font-bold hover:bg-white hover:shadow-lg transition-all">
                                    Contact Support <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="animate-fade-in text-center py-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-primary/20">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/5">
                        <Search className="h-10 w-10 text-primary/30" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2">
                        {error || "No Application Found"}
                    </h3>
                    <p className="text-muted-foreground px-8">
                        Please check your ID and try again. IDs usually start with "LF-".
                    </p>
                </div>
            )}
        </div>
    );
}
