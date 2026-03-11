"use client";

import { useState, useMemo } from "react";
import { IndianRupee, RotateCcw, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportToExcel } from "@/lib/excel-utils";
import { format, addMonths } from "date-fns";

export function FDCalculator() {
    const [principal, setPrincipal] = useState<number>(100000);
    const [rate, setRate] = useState<number>(6.5);
    const [years, setYears] = useState<number>(5);
    const [months, setMonths] = useState<number>(0);
    const [frequency, setFrequency] = useState<string>("Quarterly");

    const result = useMemo(() => {
        const P = principal;
        const r = rate / 100;
        const t = (years + months / 12);

        let n = 1; // Default to Yearly
        if (frequency === "Half-Yearly") n = 2;
        else if (frequency === "Quarterly") n = 4;
        else if (frequency === "Monthly") n = 12;

        const amount = P * Math.pow(1 + r / n, n * t);
        const interest = amount - P;

        return {
            maturityAmount: Math.round(amount),
            totalInterest: Math.round(interest),
        };
    }, [principal, rate, years, months, frequency]);

    const exportReport = () => {
        const report = [];
        const P = principal;
        const r = rate / 100;
        const totalMonths = (years * 12) + months;
        const startDate = new Date();

        let n = 1; // compounding frequency
        if (frequency === "Half-Yearly") n = 2;
        else if (frequency === "Quarterly") n = 4;
        else if (frequency === "Monthly") n = 12;

        for (let m = 1; m <= totalMonths; m++) {
            const t = m / 12;
            const currentAmount = P * Math.pow(1 + r / n, n * t);
            const interestEarned = currentAmount - P;

            report.push({
                "Month": m,
                "Date": format(addMonths(startDate, m), "dd/MM/yyyy"),
                "Investment": P.toFixed(2),
                "Interest Earned": interestEarned.toFixed(2),
                "Maturity Value": currentAmount.toFixed(2)
            });
        }

        // Add Grand Total row
        report.push({
            "Month": "Total",
            "Date": "",
            "Investment": P.toFixed(2),
            "Interest Earned": result.totalInterest.toFixed(2),
            "Maturity Value": result.maturityAmount.toFixed(2)
        });

        exportToExcel(report, `FD_Report_${principal}`, "FD_Growth_Report");
    };

    const clear = () => {
        setPrincipal(100000);
        setRate(6.5);
        setYears(5);
        setMonths(0);
        setFrequency("Quarterly");
    };

    return (
        <Card className="glass border-primary/10 shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="font-display text-xl font-bold flex items-center gap-2 text-slate-800">
                    <IndianRupee className="h-5 w-5 text-primary" /> Fixed Deposit Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Principal Amount (₹)</label>
                        <Input
                            type="number"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="h-14 font-display text-2xl font-bold rounded-2xl border-primary/10 bg-white/50 focus:bg-white transition-all text-primary"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rate of Interest (%)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Frequency</label>
                        <Select value={frequency} onValueChange={setFrequency}>
                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all font-medium">
                                <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value="Yearly" className="font-medium">Yearly</SelectItem>
                                <SelectItem value="Half-Yearly" className="font-medium">Half-Yearly</SelectItem>
                                <SelectItem value="Quarterly" className="font-medium">Quarterly</SelectItem>
                                <SelectItem value="Monthly" className="font-medium">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Years</label>
                        <Input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Months</label>
                        <Input
                            type="number"
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-6">
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 animate-fade-in">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Maturity Amount</p>
                        <p className="text-3xl font-display font-bold text-slate-900 tabular-nums">₹ {result.maturityAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Total Interest</p>
                        <p className="text-3xl font-display font-bold text-slate-900 tabular-nums">₹ {result.totalInterest.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={exportReport}
                        className="flex-1 h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <FileDown className="h-4 w-4" /> Export Report
                    </Button>
                    <Button
                        variant="outline"
                        onClick={clear}
                        className="h-12 px-6 rounded-xl border-slate-200 flex items-center justify-center gap-2 font-bold text-slate-500 hover:text-primary transition-all group"
                    >
                        <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-[-90deg]" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
