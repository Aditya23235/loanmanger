"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert, Fingerprint, ArrowRight, ShieldCheck, Undo2 } from "lucide-react";
import { toast } from "sonner";

const adminLoginSchema = z.object({
    staffId: z.string().min(4, "Invalid Staff ID"),
    accessCode: z.string().min(6, "Access code must be at least 6 characters"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AdminLoginFormValues>({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: {
            staffId: "",
            accessCode: "",
        },
    });

    const onSubmit = async (data: AdminLoginFormValues) => {
        setIsLoading(true);
        // Mock admin login delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);

        toast.success("Identity Verified. Access Granted.");
        router.push("/admin");
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="w-full max-w-md animate-fade-in text-center">
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 shadow-2xl shadow-slate-900/40">
                        <ShieldCheck className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h1 className="font-display text-3xl font-black tracking-tight flex items-center gap-2">
                        Secure Access <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-widest font-bold">Admin</span>
                    </h1>
                    <p className="mt-2 text-muted-foreground font-medium">Restricted access for internal staff and administrators.</p>
                </div>

                <Card className="glass border-slate-200 dark:border-slate-800 shadow-2xl bg-white/20">
                    <CardHeader className="p-8 pb-0 text-left">
                        <CardTitle className="font-display text-2xl font-bold flex items-center justify-between">
                            Verification Required
                            <Fingerprint className="h-6 w-6 text-slate-400" />
                        </CardTitle>
                        <CardDescription className="text-sm font-medium">Please enter your internal credentials to proceed.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField control={form.control} name="staffId" render={({ field }) => (
                                    <FormItem className="text-left">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Employee Staff ID</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <ShieldAlert className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input className="h-12 pl-12 bg-white/50 border-slate-200 focus:bg-white focus:ring-slate-900 transition-all font-mono tracking-wider" placeholder="STF-001X" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="accessCode" render={({ field }) => (
                                    <FormItem className="text-left">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Security Access Code</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Fingerprint className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input type="password" className="h-12 pl-12 bg-white/50 border-slate-200 focus:bg-white focus:ring-slate-900 transition-all" placeholder="••••••••" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <Button type="submit" disabled={isLoading} className="h-12 w-full bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                                    {isLoading ? "Verifying Identity..." : (
                                        <span className="flex items-center justify-center gap-2">Authorize Access <ArrowRight className="h-4 w-4" /></span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all uppercase tracking-tighter">
                                <Undo2 className="h-4 w-4" /> Return to Customer Portal
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                    Authorized Personnel Only · IP Logging Enabled
                </p>
            </div>
        </div>
    );
}
