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
import { User, Mail, Lock, ArrowRight, ShieldCheck, Phone, Landmark } from "lucide-react";
import { toast } from "sonner";

const signupSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function UserSignup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            router.push("/");
        }
    }, [router]);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success("Account created successfully! Please sign in.");
                router.push("/login");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Registration failed");
            }
        } catch (error) {
            toast.error("An error occurred during registration");
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
                    <h1 className="font-display text-3xl font-black tracking-tight text-slate-900">Join LoanFlow</h1>
                    <p className="mt-2 text-muted-foreground font-medium">Create an account to start your financial journey with us.</p>
                </div>

                <Card className="glass border-white/20 shadow-2xl overflow-hidden">
                    <CardHeader className="p-8 pb-0 text-left">
                        <CardTitle className="font-display text-2xl font-bold">Sign Up</CardTitle>
                        <CardDescription className="text-sm font-medium">Enter your details to register as a new member.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem className="text-left">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                                <Input className="h-12 pl-12 bg-white/50 border-white/30 focus:bg-white transition-all shadow-sm" placeholder="John Doe" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem className="text-left">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                                <Input className="h-12 pl-12 bg-white/50 border-white/30 focus:bg-white transition-all shadow-sm" placeholder="user@example.com" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem className="text-left">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Phone Number</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                                <Input className="h-12 pl-12 bg-white/50 border-white/30 focus:bg-white transition-all shadow-sm" placeholder="+91 9876543210" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem className="text-left">
                                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Create Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                                <Input type="password" className="h-12 pl-12 bg-white/50 border-white/30 focus:bg-white transition-all shadow-sm" placeholder="••••••••" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <Button type="submit" disabled={isLoading} className="h-12 w-full bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all transform-gpu active:scale-95 mt-2">
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">Creating Account... <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /></span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2 text-lg">Create Account <ArrowRight className="h-5 w-5" /></span>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground font-medium">
                                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In here</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
