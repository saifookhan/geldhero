"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthenticatedHeader from "@/components/authenticated-header";
import {
  LayoutGrid,
  BarChart,
  List,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (pathname?.startsWith("/admin/login")) {
        setLoading(false);
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        router.push("/admin/login");
        return;
      }

      const role =
        session.user.user_metadata?.role ||
        (session.user.app_metadata as any)?.role;
      if (role !== "admin") {
        router.push("/admin/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/admin/score", label: "Score Matrix", icon: List },
    { href: "/admin/score-results", label: "Score Results", icon: BarChart },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-300 mx-auto" />
          <p className="mt-4">Loading admin...</p>
        </div>
      </div>
    );
  }

  if (pathname?.startsWith("/admin/login")) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedHeader user={user} handleSignOut={handleSignOut} />

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="flex gap-6 items-start">
          {/* ── SIDEBAR ── */}
          <aside
            className={`
              relative shrink-0 rounded-3xl border border-gray-200 bg-white shadow-sm
              transition-all duration-300 ease-in-out
              ${collapsed ? "w-[68px] p-3" : "w-[280px] p-5"}
            `}
          >
            {/* Collapse toggle button */}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="
                absolute -right-3 top-6
                flex items-center justify-center
                h-6 w-6 rounded-full
                bg-white border border-gray-200 shadow-sm
                text-gray-500 hover:text-primary hover:border-primary
                transition-colors z-10
              "
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </button>

            {/* Header */}
            <div
              className={`flex items-center gap-3 mb-6 overflow-hidden ${collapsed ? "justify-center" : ""}`}
            >
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    Admin Menu
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Secure admin section
                  </p>
                </div>
              )}
            </div>

            {/* Nav items */}
            <nav className="space-y-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={`
                      flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition
                      ${collapsed ? "justify-center" : ""}
                      ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
