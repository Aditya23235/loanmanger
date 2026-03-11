"use client";

import { useState, useMemo } from "react";
import { IndianRupee, RotateCcw, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportToExcel } from "@/lib/excel-utils";
import { format, addMonths } from "date-fns";

export function RDCalculator() {
    const [installment, setInstallment] = useState<number>(5000);
    const [rate, setRate] = useState<number>(7.0);
    const [months, setMonths] = useState<number>(36);

    const result = useMemo(() => {
        const P = installment;
        const R = rate;
        const N = months;
        const i = R / 400; // Standard quarterly compounding interest for Indian banks

        let maturityAmount = 0;
        // The common bank formula for RD Maturity Amount
        // Final Amount M = P * ((1 + i)^n - 1) / (1 - (1 + i)^-1/3)
        // where i = quarterly rate, n = number of quarters
        if (N > 0) {
            const nQuarters = N / 3;
            maturityAmount = P * (Math.pow(1 + i, nQuarters) - 1) / (1 - Math.pow(1 + i, -1 / 3));
        }

        const totalInvested = P * N;
        const totalInterest = maturityAmount - totalInvested;

        return {
            maturityAmount: Math.round(maturityAmount),
            totalInvested: Math.round(totalInvested),
            totalInterest: Math.round(totalInterest),
        };
    }, [installment, rate, months]);

    const exportPlan = () => {
        const plan = [];
        const P = installment;
        const R = rate;
        const totalMonths = months;
        const startDate = new Date();
        const i = R / 400; // Quarterly compounding

        for (let m = 1; m <= totalMonths; m++) {
            const nQuarters = m / 3;
            const maturityAmount = P * (Math.pow(1 + i, nQuarters) - 1) / (1 - Math.pow(1 + i, -1 / 3));
            const totalInvested = P * m;
            const interestEarned = maturityAmount - totalInvested;

            plan.push({
                "Month": m,
                "Date": format(addMonths(startDate, m), "dd/MM/yyyy"),
                "Monthly Installment": P.toFixed(2),
                "Total Invested": totalInvested.toFixed(2),
                "Interest Earned": interestEarned.toFixed(2),
                "Total Value": maturityAmount.toFixed(2)
            });
        }

        // Add Grand Total row
        plan.push({
            "Month": "Total",
            "Date": "",
            "Monthly Installment": "",
            "Total Invested": result.totalInvested.toFixed(2),
            "Interest Earned": result.totalInterest.toFixed(2),
            "Total Value": result.maturityAmount.toFixed(2)
        });

        exportToExcel(plan, `RD_Plan_${installment}`, "RD_Investment_Plan");
    };

    const clear = () => {
        setInstallment(5000);
        setRate(7.0);
        setMonths(36);
    };

    return (
        <Card className="glass border-primary/10 shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="font-display text-xl font-bold flex items-center gap-2 text-slate-800">
                    <IndianRupee className="h-5 w-5 text-primary" /> Recurring Deposit Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Monthly Installment (₹)</label>
                        <Input
                            type="number"
                            step="500"
                            value={installment}
                            onChange={(e) => setInstallment(Number(e.target.value))}
                            className="h-14 font-display text-2xl font-bold rounded-2xl border-primary/10 bg-white/50 focus:bg-white transition-all text-primary"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Interest Rate (%)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Duration (Months)</label>
                        <Input
                            type="number"
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-fade-in">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Investment</p>
                        <p className="text-xl font-display font-medium text-slate-900 tabular-nums">₹ {result.totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Earned Interest</p>
                        <p className="text-xl font-display font-medium text-slate-900 tabular-nums">₹ {result.totalInterest.toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Maturity Amount</p>
                        <p className="text-xl font-display font-bold text-slate-900 tabular-nums">₹ {result.maturityAmount.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={exportPlan}
                        className="flex-1 h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <FileDown className="h-4 w-4" /> Export Plan
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
