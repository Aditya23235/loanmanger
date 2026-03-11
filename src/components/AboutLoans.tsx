"use client";

import {
    ShieldCheck,
    Zap,
    Clock,
    CheckCircle2,
    ArrowRight,
    TrendingUp
} from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const loanTypeItems = [
    {
        image: "/schemes/home_ownership_modern.png",
        title: "Smart Home Ownership",
        description: "Buy your dream home with just 35% downpayment. Enjoy simple, fixed, and stress-free monthly payments until possession — 100% loan-free."
    },
    {
        image: "/schemes/groceries_fd_benefit.png",
        title: "Free Groceries on FD",
        description: "Invest ₹50,000 or more in an FD for a year and get free groceries worth ₹2,000. No processing fees, no hidden charges — just pure savings."
    },
    {
        image: "/schemes/education_savings_future.png",
        title: "Education Scheme (FD)",
        description: "Deposit ₹10 Lakh and we will pay your child's school fees. 16% return p.a. in terms of fees with a 3-5 year tenure. No processing fees."
    },
    {
        image: "/schemes/gold_investment_secure.png",
        title: "Gold Scheme",
        description: "Turn your gold into growth. Instant finance for ornaments & coins at 3% to 5% interest. Trusted by thousands with safe & secure processing."
    },
    {
        image: "/schemes/fixed_deposit_growth.png",
        title: "Loan Against FD",
        description: "Get 3x loan on FD with mortgage security. Starts loans from ₹1 CR onwards at attractive interest rates. Hassle-free and secure process."
    },
    {
        image: "/schemes/two_wheeler_finance.png",
        title: "Two-Wheeler FD Scheme",
        description: "Deposit ₹3 Lakhs or above for 3 years and get your favorite two-wheeler worth ₹1 Lakh plus ₹4,000 fuel credit instantly."
    },
];


export function AboutLoans() {
    return (
        <section className="mt-12 space-y-16 pb-24 animate-fade-in px-4">

            {/* Static Schemes Grid */}
            <div className="space-y-16 max-w-7xl mx-auto">
                <div className="text-center space-y-4">
                    <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl text-slate-900 leading-tight">
                        Our Exclusive <span className="text-gradient">Financial Schemes</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
                        Discover tailored financial products designed with your growth and security in mind.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {loanTypeItems.map((item, index) => (
                        <Card key={item.title} className="group relative overflow-hidden rounded-[2.5rem] border-slate-200/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                            <div className="aspect-[3/4] relative overflow-hidden bg-slate-50">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

        </section>
    );
}
