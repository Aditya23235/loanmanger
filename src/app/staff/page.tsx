"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Eye, Filter, Plus, Download, Search, Loader2, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { exportToExcel } from "@/lib/excel-utils";

export default function StaffDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [riskFilter, setRiskFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchApplications() {
            try {
                const res = await fetch("/api/applications");
                const data = await res.json();
                if (data.success) {
                    setApplications(data.applications);
                }
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchApplications();
    }, []);

    const filtered = applications.filter((app) => {
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        const matchesRisk = riskFilter === "all" || app.riskLevel === riskFilter;
        const matchesSearch = !searchQuery ||
            app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app._id && app._id.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesRisk && matchesSearch;
    });

    const stats = {
        pending: applications.filter(a => a.status === "Submitted" || a.status === "Under Review").length,
        highRisk: applications.filter(a => a.riskLevel === "High").length,
        approved: applications.filter(a => a.status === "Approved").length,
        total: applications.length
    };

    const exportApplications = () => {
        if (filtered.length === 0) return;
        const data = filtered.map(app => ({
            "Applicant ID": app._id,
            "Full Name": app.fullName,
            "Monthly Income": app.monthlyIncome,
            "Loan Requested": app.loanAmountRequested,
            "Tenure": app.tenure,
            "Risk Score": app.riskScore,
            "Risk Level": app.riskLevel,
            "Status": app.status
        }));
        exportToExcel(data, "Loan_Applications_Registry", "Applications");
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="font-bold">Loading Applications...</span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 animate-fade-in">
            {/* Header */}
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Internal Operations</p>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">Staff Dashboard</h1>
                    <p className="text-slate-600">Monitor and manage all {stats.total} live incoming loan requests.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={exportApplications}
                        className="h-12 rounded-xl px-6 font-bold shadow-sm hover:bg-white hover:shadow-md transition-all"
                    >
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <div className="flex items-center gap-2 rounded-xl bg-primary px-5 text-white shadow-xl shadow-primary/20">
                        <Database className="h-4 w-4" />
                        <span className="text-sm font-bold uppercase tracking-widest">Live Sync</span>
                    </div>
                </div>
            </div >

            {/* Stats Overview */}
            < div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" >
                {
                    [
                        { label: "Pending Review", count: stats.pending, color: "bg-amber-500" },
                        { label: "High Risk", count: stats.highRisk, color: "bg-rose-500" },
                        { label: "Approved Overall", count: stats.approved, color: "bg-emerald-500" },
                        { label: "Total Active", count: stats.total, color: "bg-primary" },
                    ].map((stat) => (
                        <Card key={stat.label} className="glass p-6 border-white/20 hover:shadow-xl transition-all">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="font-display text-3xl font-black">{stat.count}</span>
                                <div className={`h-2 w-12 rounded-full ${stat.color} opacity-20`} />
                            </div>
                        </Card>
                    ))
                }
            </div >

            <Card className="glass overflow-hidden shadow-2xl border-white/20">
                <CardHeader className="bg-white/50 border-b border-white/20 p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <CardTitle className="font-display text-2xl font-bold">Applications Registry</CardTitle>
                            <CardDescription className="text-sm font-medium">Real-time view of all submitted forms.</CardDescription>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="relative min-w-[200px] flex-1 lg:flex-none">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                <Input
                                    placeholder="Search name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-11 pl-9 bg-white/50 rounded-xl border-white/30"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-11 w-[150px] bg-white/50 rounded-xl border-white/30 font-semibold"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent className="rounded-xl border-white/30 backdrop-blur-xl">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Submitted">Submitted</SelectItem>
                                    <SelectItem value="Under Review">Under Review</SelectItem>
                                    <SelectItem value="Documents Pending">Pending Docs</SelectItem>
                                    <SelectItem value="Risk Assessed">Assessed</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={riskFilter} onValueChange={setRiskFilter}>
                                <SelectTrigger className="h-11 w-[140px] bg-white/50 rounded-xl border-white/30 font-semibold"><SelectValue placeholder="Risk" /></SelectTrigger>
                                <SelectContent className="rounded-xl border-white/30 backdrop-blur-xl">
                                    <SelectItem value="all">All Risks</SelectItem>
                                    <SelectItem value="Low">Low Risk</SelectItem>
                                    <SelectItem value="Medium">Medium Risk</SelectItem>
                                    <SelectItem value="High">High Risk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-b-white/20">
                                    <TableHead className="py-5 font-bold text-muted-foreground pl-8">Applicant Profile</TableHead>
                                    <TableHead className="font-bold text-muted-foreground text-right">Income</TableHead>
                                    <TableHead className="font-bold text-muted-foreground text-right">Requested</TableHead>
                                    <TableHead className="font-bold text-muted-foreground text-center">Risk Level</TableHead>
                                    <TableHead className="font-bold text-muted-foreground text-center">Status</TableHead>
                                    <TableHead className="font-bold text-muted-foreground text-center pr-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((app) => (
                                    <TableRow key={app._id} className="group border-b-white/10 hover:bg-white/40 transition-colors">
                                        <TableCell className="py-6 pl-8">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base tracking-tight">{app.fullName}</span>
                                                <span className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-widest">ID: {app._id?.slice(-8)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">₹{app.monthlyIncome?.toLocaleString("en-IN")}</TableCell>
                                        <TableCell className="text-right font-bold text-primary">₹{app.loanAmountRequested?.toLocaleString("en-IN")}</TableCell>
                                        <TableCell className="text-center"><RiskBadge level={app.riskLevel || 'Low'} /></TableCell>
                                        <TableCell className="text-center"><StatusBadge status={app.status || 'Pending'} /></TableCell>
                                        <TableCell className="text-center pr-8">
                                            <Button variant="ghost" size="sm" asChild className="h-10 w-10 p-0 rounded-xl hover:bg-primary hover:text-white transition-all">
                                                <Link href={`/staff/loan/${app._id}`}><Eye className="h-5 w-5" /></Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-40 text-center py-20">
                                            <div className="flex flex-col items-center gap-2">
                                                <Filter className="h-10 w-10 text-muted-foreground/20" />
                                                <p className="font-display font-bold text-muted-foreground">No live applications found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
