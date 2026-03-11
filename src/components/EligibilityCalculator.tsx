"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { exportToExcel } from "@/lib/excel-utils";
import { format, addMonths } from "date-fns";

export function EligibilityCalculator() {
    const [loanAmount, setLoanAmount] = useState(750000);
    const [tenure, setTenure] = useState(5);
    const [interestRate, setInterestRate] = useState(5);

    const results = useMemo(() => {
        const P = loanAmount;
        const r = interestRate / 12 / 100;
        const n = tenure * 12;

        const emi = P * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalAmount = emi * n;
        const totalInterest = totalAmount - P;

        return {
            emi: Math.round(emi),
            totalAmount: Math.round(totalAmount),
            totalInterest: Math.round(totalInterest),
        };
    }, [loanAmount, tenure, interestRate]);

    const exportSchedule = () => {
        const schedule = [];
        let balance = loanAmount;
        const r = interestRate / 12 / 100;
        const n = tenure * 12;

        // Calculate raw EMI for the schedule for better precision
        const emiRaw = loanAmount * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
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

        exportToExcel(schedule, `EMI_Schedule_${loanAmount}`, "Repayment_Schedule");
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto font-sans p-4">
            {/* Input Side */}
            <div className="bg-white rounded-[2rem] p-8 space-y-12 border border-slate-200/60 shadow-xl shadow-slate-200/20">
                {/* Loan Amount */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-slate-800 font-bold text-base tracking-tight">Loan Amount</label>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-inner">
                            <span className="text-slate-400 font-semibold">₹</span>
                            <span className="text-slate-900 font-bold text-xl tabular-nums">
                                {loanAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="relative pt-2">
                        <Slider
                            value={[loanAmount]}
                            onValueChange={(val) => setLoanAmount(val[0])}
                            min={25000}
                            max={5000000}
                            step={25000}
                            className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-primary [&_[role=slider]]:shadow-lg h-2"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            <span>₹ 25k</span>
                            <span>₹ 50L</span>
                        </div>
                    </div>
                </div>

                {/* Loan Tenure */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-slate-800 font-bold text-base tracking-tight">Loan Tenure</label>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 min-w-[60px] text-center shadow-inner">
                            <span className="text-slate-900 font-bold text-xl tabular-nums">{tenure}</span>
                            <span className="ml-1 text-[10px] font-semibold text-slate-400 uppercase">Yrs</span>
                        </div>
                    </div>
                    <div className="relative pt-2">
                        <Slider
                            value={[tenure]}
                            onValueChange={(val) => setTenure(val[0])}
                            min={1}
                            max={20}
                            step={1}
                            className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:bg-primary [&_[role=slider]]:shadow-lg h-2"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            <span>1 year</span>
                            <span>20 years</span>
                        </div>
                    </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-slate-800 font-bold text-base tracking-tight">Interest Rate</label>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-1 shadow-inner">
                            <span className="text-slate-900 font-bold text-xl tabular-nums">{interestRate}</span>
                            <span className="text-slate-400 font-semibold">%</span>
                        </div>
                    </div>
                    <div className="relative pt-2">
                        <Slider
                            value={[interestRate]}
                            onValueChange={(val) => setInterestRate(val[0])}
                            min={5}
                            max={25}
                            step={0.1}
                            className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:shadow-lg h-2"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            <span>5.0%</span>
                            <span>25.0%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Output Side */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-[2rem] p-8 border border-primary/10 flex flex-col items-center text-slate-900 shadow-2xl">
                <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white w-full py-10 px-6 text-center space-y-2 mb-10 shadow-xl shadow-primary/5">
                    <p className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Estimated Monthly EMI</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-semibold text-primary/40">₹</span>
                        <span className="text-6xl font-bold text-primary tabular-nums tracking-tighter">
                            {results.emi.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="w-full space-y-6 mb-12 px-2">
                    <div className="flex justify-between items-center group">
                        <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Payable</span>
                        <span className="text-slate-900 font-bold text-2xl tabular-nums tracking-tight group-hover:text-primary transition-colors">
                            ₹ {results.totalAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Interest Component</span>
                        <span className="text-accent font-bold text-2xl tabular-nums tracking-tight">
                            ₹ {results.totalInterest.toLocaleString()}
                        </span>
                    </div>
                    <div className="h-px bg-primary/10 w-full" />
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Principal Amount</span>
                        <span className="text-slate-700 font-semibold text-lg tabular-nums">
                            ₹ {loanAmount.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="w-full mt-auto space-y-4">
                    <Button
                        onClick={exportSchedule}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/10 transition-all active:scale-95"
                    >
                        <FileDown className="h-5 w-5" />
                        Export Repayment Schedule
                    </Button>
                </div>
            </div>
        </div>
    );
}
