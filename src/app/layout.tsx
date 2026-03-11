import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CustomerNav } from "@/components/CustomerNav";

const bodyFont = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-body",
});

const displayFont = Outfit({
    subsets: ["latin"],
    variable: "--font-display",
});

export const metadata: Metadata = {
    title: "LoanFlow - Modern Loan Management",
    description: "Secure and transparent loan management by LoanFlow.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${bodyFont.variable} ${displayFont.variable} font-sans antialiased text-slate-900`}>
                <Providers>
                    <CustomerNav />
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}
