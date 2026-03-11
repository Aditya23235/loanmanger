"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calculator as CalcIcon,
    PiggyBank,
    TrendingUp,
    Calendar as AgeIcon
} from "lucide-react";
import { EligibilityCalculator as EMICalculator } from "@/components/EligibilityCalculator";
import { FDCalculator } from "./FDCalculator";
import { RDCalculator } from "./RDCalculator";
import { AgeCalculator } from "./AgeCalculator";

export function FinancialHub() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <Tabs defaultValue="emi" className="space-y-12">
                <div className="flex justify-center">
                    <TabsList className="h-14 p-1 bg-white/50 backdrop-blur-md rounded-2xl border border-primary/10 shadow-xl w-full max-w-2xl grid grid-cols-4">
                        <TabsTrigger
                            value="emi"
                            className="rounded-xl flex items-center gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                        >
                            <CalcIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">EMI Calculator</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="fd"
                            className="rounded-xl flex items-center gap-2 font-bold data-[state=active]:bg-success data-[state=active]:text-white transition-all"
                        >
                            <PiggyBank className="h-4 w-4" />
                            <span className="hidden sm:inline">Fixed Deposit</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="rd"
                            className="rounded-xl flex items-center gap-2 font-bold data-[state=active]:bg-accent data-[state=active]:text-white transition-all"
                        >
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Recurring Deposit</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="age"
                            className="rounded-xl flex items-center gap-2 font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all"
                        >
                            <AgeIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Age Calculator</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="animate-fade-in">
                    <TabsContent value="emi" className="focus-visible:outline-none">
                        <EMICalculator />
                    </TabsContent>
                    <TabsContent value="fd" className="focus-visible:outline-none max-w-4xl mx-auto">
                        <FDCalculator />
                    </TabsContent>
                    <TabsContent value="rd" className="focus-visible:outline-none max-w-4xl mx-auto">
                        <RDCalculator />
                    </TabsContent>
                    <TabsContent value="age" className="focus-visible:outline-none max-w-4xl mx-auto">
                        <AgeCalculator />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
