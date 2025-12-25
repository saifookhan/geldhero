"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary">GeldHero</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to GeldHero! 👋
          </h2>
          <p className="text-gray-600">
            Ready to start your financial planning journey? Let&apos;s turn your
            goals into reality.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Goals
                </p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progress</p>
                <p className="text-2xl font-semibold text-gray-900">0%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Monthly Savings
                </p>
                <p className="text-2xl font-semibold text-gray-900">€0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Next Milestone
                </p>
                <p className="text-2xl font-semibold text-gray-900">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Getting Started
          </h3>
          <p className="text-gray-600 mb-6">
            Complete these steps to set up your financial planning journey:
          </p>

          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  Add Your Financial Information
                </h4>
                <p className="text-sm text-gray-600">
                  Enter your income, expenses, and current savings
                </p>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-500">Set Your Goals</h4>
                <p className="text-sm text-gray-600">
                  Define up to 3 financial goals
                </p>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-4">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-500">
                  Get Your AI-Powered Plan
                </h4>
                <p className="text-sm text-gray-600">
                  Receive personalized recommendations
                </p>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-primary/5 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              🚀 We&apos;re working hard to bring you these features!
            </h4>
            <p className="text-gray-600 text-sm">
              Our team is actively developing the financial planning tools.
              You&apos;ll be notified as soon as they&apos;re ready. Thank you
              for your patience!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
