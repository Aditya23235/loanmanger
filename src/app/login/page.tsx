"use client";

import { useState, useEffect } from "react";
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
import { User, Lock, ArrowRight, ShieldCheck, Sparkles, Landmark } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function UserLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            router.push("/");
        }
    }, [router]);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(`Welcome back, ${result.user.fullName}!`, {
                    description: "Login successful. Redirecting to your dashboard.",
                });
                // In a real app, store the user in a context or cookie here
                localStorage.setItem("user", JSON.stringify(result.user));
                router.push("/");
            } else {
                toast.error(result.message || "Invalid credentials", {
                    description: "Please check your email and password and try again.",
                });
            }
        } catch (error) {
            toast.error("An error occurred during login", {
                description: "Something went wrong while connecting to the server.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-in text-center">
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-2xl shadow-primary/10">
                        <Landmark className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="font-display text-3xl font-black tracking-tight">Customer Portal</h1>
                    <p className="mt-2 text-muted-foreground font-medium">Manage your loans and applications safely.</p>
                </div>

                <Card className="glass border-white/20 shadow-2xl">
                    <CardHeader className="p-8 pb-0 text-left">
                        <CardTitle className="font-display text-2xl font-bold">Sign In</CardTitle>
                        <CardDescription className="text-sm font-medium">Use your registered email to access your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem className="text-left">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                                <Input className="h-12 pl-12 bg-white/50 border-white/30 focus:bg-white transition-all" placeholder="user@example.com" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem className="text-left">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                                <Input type="password" className="h-12 pl-12 bg-white/50 border-white/30 focus:bg-white transition-all" placeholder="••••••••" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <Button type="submit" disabled={isLoading} className="h-12 w-full bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                                    {isLoading ? "Authenticating..." : (
                                        <span className="flex items-center justify-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground font-medium">
                                Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Create account</Link>
                            </p>
                            <Link href="/staff/login" className="mx-auto flex w-fit items-center gap-2 rounded-full bg-secondary/50 px-4 py-1.5 text-xs font-bold text-muted-foreground hover:bg-white hover:text-primary transition-all">
                                <ShieldCheck className="h-4 w-4" /> Staff Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
