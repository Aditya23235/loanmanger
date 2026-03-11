"use client";

import { useState } from "react";
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from "date-fns";
import { Calendar as CalendarIcon, RotateCcw, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportToExcel } from "@/lib/excel-utils";

export function AgeCalculator() {
    const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [toDate, setToDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

    const calculate = () => {
        let start = new Date(fromDate);
        let end = new Date(toDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

        // Swap if start is after end
        if (start > end) {
            [start, end] = [end, start];
        }

        let years = differenceInYears(end, start);
        let tempDate = addYears(start, years);

        if (tempDate > end) {
            years--;
            tempDate = addYears(start, years);
        }

        let months = differenceInMonths(end, tempDate);
        tempDate = addMonths(tempDate, months);

        const days = differenceInDays(end, tempDate);

        setResult({ years, months, days });
    };

    const exportSummary = () => {
        if (!result) return;
        const data = [
            { "Metric": "From Date", "Value": fromDate },
            { "Metric": "To Date", "Value": toDate },
            { "Metric": "Years", "Value": result.years },
            { "Metric": "Months", "Value": result.months },
            { "Metric": "Days", "Value": result.days }
        ];
        exportToExcel(data, "Age_Summary", "Summary");
    };

    const clear = () => {
        setFromDate(format(new Date(), "yyyy-MM-dd"));
        setToDate(format(new Date(), "yyyy-MM-dd"));
        setResult(null);
    };

    return (
        <Card className="glass border-primary/10 shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="font-display text-xl font-bold flex items-center gap-2 text-slate-800">
                    <CalendarIcon className="h-5 w-5 text-primary" /> Age & Days Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">From Date</label>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">To Date</label>
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={calculate}
                        className="flex-1 h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                        Calculate
                    </Button>
                    {result && (
                        <Button
                            variant="outline"
                            onClick={exportSummary}
                            className="h-12 w-12 rounded-xl border-slate-200 flex items-center justify-center p-0 text-primary hover:text-primary/80"
                            title="Export to Excel"
                        >
                            <FileDown className="h-5 w-5" />
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={clear}
                        className="h-12 w-12 rounded-xl border-slate-200 flex items-center justify-center p-0"
                    >
                        <RotateCcw className="h-5 w-5 text-slate-400" />
                    </Button>
                </div>

                {result && (
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-center animate-slide-in">
                            <p className="text-3xl font-bold text-primary tabular-nums">{result.years}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Years</p>
                        </div>
                        <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10 text-center animate-slide-in" style={{ animationDelay: '0.1s' }}>
                            <p className="text-3xl font-bold text-accent tabular-nums">{result.months}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Months</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center animate-slide-in" style={{ animationDelay: '0.2s' }}>
                            <p className="text-3xl font-bold text-slate-700 tabular-nums">{result.days}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Days</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
