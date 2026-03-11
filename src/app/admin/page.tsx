"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { CheckCircle2, XCircle, FileText, TrendingUp, Users, Calendar, ArrowUpRight, Loader2, Database } from "lucide-react";

export default function AdminPanel() {
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchApplications() {
            try {
                const res = await fetch("/api/applications");
                const data = await res.json();
                if (data.success) {
                    setApplications(data.applications);
                }
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchApplications();
    }, []);

    const stats = {
        total: applications.length,
        approved: applications.filter((a) => a.status === "Approved").length,
        rejected: applications.filter((a) => a.status === "Rejected").length,
        avgRisk: applications.length > 0
            ? Math.round(applications.reduce((s, a) => s + (a.riskScore || 0), 0) / applications.length)
            : 0,
    };

    const statusCounts = ["Submitted", "Under Review", "Approved", "Rejected"].map(
        (status) => ({
            status: status,
            count: applications.filter((a) => a.status === status).length,
        })
    );

    const riskCounts = [
        { name: "Low Risk", value: applications.filter(a => (a.riskScore || 0) <= 30).length, color: "hsl(142, 71%, 45%)" },
        { name: "Med Risk", value: applications.filter(a => (a.riskScore || 0) > 30 && (a.riskScore || 0) <= 60).length, color: "hsl(38, 92%, 50%)" },
        { name: "High Risk", value: applications.filter(a => (a.riskScore || 0) > 60).length, color: "hsl(0, 84%, 60%)" },
    ];

    const barColors = ["hsl(210, 80%, 52%)", "hsl(38, 92%, 50%)", "hsl(142, 71%, 45%)", "hsl(0, 84%, 60%)"];

    const analyticsCards = [
        { label: "Total Applications", value: stats.total, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
        { label: "Avg Risk Index", value: stats.avgRisk, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="font-bold">Syncing Database...</span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 animate-fade-in">
            {/* Header */}
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Live Database</p>
                    <h1 className="font-display text-4xl font-extrabold tracking-tight">Admin Console</h1>
                    <p className="text-muted-foreground">Managing {stats.total} live application records from MongoDB.</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-primary px-5 py-2.5 text-white shadow-lg shadow-primary/20">
                    <Database className="h-4 w-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">PostgreSQL Active</span>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                {analyticsCards.map((card) => (
                    <Card key={card.label} className="glass border-white/20 group hover:shadow-2xl transition-all duration-500">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${card.bg} group-hover:scale-110 transition-transform`}>
                                    <card.icon className={`h-6 w-6 ${card.color}`} />
                                </div>
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">{card.label}</p>
                            <p className="font-display text-4xl font-black mt-1 tracking-tight">{card.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3 mb-10">
                {/* Status Distribution */}
                <Card className="glass lg:col-span-2 border-white/20 shadow-2xl">
                    <CardHeader className="p-8 border-b border-white/10">
                        <CardTitle className="font-display text-2xl font-bold">Applications by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statusCounts}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                    <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={50}>
                                        {statusCounts.map((_, i) => (
                                            <Cell key={i} fill={barColors[i % 4]} fillOpacity={0.8} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk Profile */}
                <Card className="glass border-white/20 shadow-2xl">
                    <CardHeader className="p-8 border-b border-white/10">
                        <CardTitle className="font-display text-2xl font-bold">Risk Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={riskCounts} innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                                        {riskCounts.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 space-y-4">
                            {riskCounts.map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/20">
                                    <span className="text-sm font-bold">{item.name}</span>
                                    <span className="font-black">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List Table */}
            <Card className="glass border-white/20 shadow-2xl overflow-hidden">
                <CardHeader className="p-8 border-b border-white/10 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-display text-2xl font-bold">Recent Submissions</CardTitle>
                        <CardDescription>Latest live records from the database.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-primary/5 text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-white/10">
                                <tr>
                                    <th className="px-8 py-4">Full Name</th>
                                    <th className="px-8 py-4">Loan Amount</th>
                                    <th className="px-8 py-4">Risk Level</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {applications.slice(0, 10).map((app) => (
                                    <tr key={app._id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-800">{app.fullName}</p>
                                            <p className="text-xs text-muted-foreground">ID: {app._id?.slice(-8)}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-black text-slate-900">₹{app.loanAmountRequested?.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">{app.tenure} Months</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${(app.riskScore || 0) <= 30 ? 'bg-emerald-100 text-emerald-700' :
                                                (app.riskScore || 0) <= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {app.riskLevel || 'N/A'} ({(app.riskScore || 0)})
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full ${app.status === 'Approved' ? 'bg-emerald-500' :
                                                    app.status === 'Rejected' ? 'bg-rose-500' : 'bg-blue-500 animate-pulse'
                                                    }`} />
                                                <span className="text-sm font-bold text-slate-700">{app.status || 'Submitted'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 rounded-lg bg-white/50 border border-white/20 hover:bg-white shadow-sm transition-all group-hover:scale-110">
                                                <ArrowUpRight className="h-4 w-4 text-primary" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity Footer */}
            <div className="mt-12 text-center text-muted-foreground">
                <p className="text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Database Live · Real-time sync active
                </p>
            </div>
        </div>
    );
}
