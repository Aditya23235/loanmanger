"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreditCard, FileText, LayoutDashboard, Shield, LogOut, Calculator, Landmark } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Apply", href: "/", icon: FileText },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Staff Menu", href: "/staff", icon: LayoutDashboard },
  { label: "Admin Dashboard", href: "/admin", icon: Shield },
];

export function CustomerNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 md:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-6 backdrop-blur-xl shadow-lg dark:bg-black/40">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-primary/10 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform text-primary">
            <Landmark className="h-6 w-6" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-gradient">LoanFlow</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {navItems
            .filter((item) => {
              if (user?.role === "admin") return true; // Admin sees everything
              if (item.label === "Apply" || item.label === "Calculator") return true; // Customers & Guests see these
              if (user?.role === "staff" && item.label === "Staff Menu") return true; // Staff sees staff menu
              return false;
            })
            .map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300",
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                      : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !isActive && "opacity-70")} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="mx-2 h-6 w-[1px] bg-slate-200 hidden md:block" />
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60 leading-none">Logged in as</span>
                <span className="text-sm font-bold text-slate-700">{user.fullName?.split(' ')[0] || 'User'}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform-gpu active:scale-95 group"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-black text-white shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all transform-gpu active:scale-95"
              >
                Sign In
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
