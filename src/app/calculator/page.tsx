"use client";

import { FinancialHub } from "@/components/calculators/FinancialHub";
import { Footer } from "@/components/Footer";

export default function CalculatorPage() {
    return (
        <div className="mx-auto w-full px-4 py-12 md:px-8">
            <div className="mb-16 text-center animate-fade-in">
                <h1 className="mb-6 font-display text-5xl font-bold tracking-tight md:text-6xl text-slate-900">
                    Financial <span className="text-gradient">Calculator</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-600">
                    Plan your savings and loans better with our comprehensive set of financial tools.
                    Calculate EMIs, Fixed Deposits, and Recurring Deposits with ease.
                </p>
            </div>

            <div className="relative group max-w-7xl mx-auto mb-24">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <FinancialHub />
            </div>

            <Footer />
        </div>
    );
}
