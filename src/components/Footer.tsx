"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    MapPin,
    Phone,
    Mail,
    Landmark
} from "lucide-react";

export function Footer() {
    return (
        <footer className="mt-24 border-t border-slate-200 bg-white/50 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
                <div className="grid gap-12 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-primary/10 text-primary shadow-lg shadow-primary/10">
                                <Landmark className="h-6 w-6" />
                            </div>
                            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">LoanFlow</span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-slate-600 font-medium">
                            Empowering your financial future with secure, transparent, and community-focused banking solutions since 2012.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: "#" },
                                { Icon: Twitter, href: "#" },
                                { Icon: Instagram, href: "#" },
                                { Icon: Youtube, href: "#" },
                            ].map(({ Icon, href }, i) => (
                                <Link
                                    key={i}
                                    href={href}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition-all hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10"
                                >
                                    <Icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Deposits & Loans */}
                    <div>
                        <h4 className="mb-8 font-display text-lg font-bold text-slate-900">Deposits & Loans</h4>
                        <ul className="space-y-4">
                            {[
                                "Fixed Deposits",
                                "Recurring Deposits",
                                "Savings Accounts",
                                "Home Loans",
                                "Personal Loans",
                                "Business Loans",
                                "Startup Loans",
                                "Loan Against FD"
                            ].map((item) => (
                                <li key={item} className="group flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary transition-all group-hover:scale-150" />
                                    <Link href="#" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Schemes */}
                    <div>
                        <h4 className="mb-8 font-display text-lg font-bold text-slate-900">Our Schemes</h4>
                        <ul className="space-y-4">
                            {[
                                "Sweep In",
                                "Real Estate Scheme",
                                "Vehicle Scheme",
                                "Education Scheme",
                                "Gold Scheme",
                                "Electronics Scheme",
                                "Groceries Scheme"
                            ].map((item) => (
                                <li key={item} className="group flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary transition-all group-hover:scale-150" />
                                    <Link href="#" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get in Touch */}
                    <div>
                        <h4 className="mb-8 font-display text-lg font-bold text-slate-900">Get in Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-slate-600">
                                    G01, G02, The Chambers, Viman Nagar, Pune - 411014
                                </p>
                            </li>
                            <li className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">
                                    8265092614
                                </p>
                            </li>
                            <li className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">
                                    info@loanflow.com
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-200 pt-8 md:flex-row">
                    <p className="text-xs font-medium text-slate-500">
                        © {new Date().getFullYear()} LoanFlow Solutions. All rights reserved.
                    </p>
                    <div className="mt-4 flex gap-6 md:mt-0">
                        <Link href="#" className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
