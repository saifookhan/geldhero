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
  ShieldCheck,
} from "lucide-react";
import AuthenticatedHeader from "@/components/authenticated-header";

interface ScoreBreakdownItem {
  factor: string;
  factor_slug: string;
  userValue: string | number;
  matchedCondition: string;
  score: number;
  maxPoints: number;
}

interface RiskCapacityScore {
  id: number;
  total_score: number;
  max_possible_score: number;
  score_breakdown: ScoreBreakdownItem[];
  calculated_at: string;
}

const getRiskBand = (score: number, max: number) => {
  const pct = max > 0 ? (score / max) * 100 : 0;
  if (pct <= 35) return "Low";
  if (pct <= 65) return "Medium";
  return "High";
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [riskScore, setRiskScore] = useState<RiskCapacityScore | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setScoreLoading(true);
        const { data } = await supabase
          .from("risk_capacity_scores")
          .select("id,total_score,max_possible_score,score_breakdown,calculated_at")
          .eq("user_email", session.user.email)
          .order("calculated_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        setRiskScore(data || null);
        setScoreLoading(false);
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
      <AuthenticatedHeader user={user} handleSignOut={handleSignOut} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Your Risk Capacity Score
            </h3>
          </div>

          {scoreLoading ? (
            <p className="text-gray-500 text-sm">Loading your score...</p>
          ) : !riskScore ? (
            <p className="text-gray-500 text-sm">
              No score yet. Complete your financial assessment to see your
              results.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <p className="text-2xl font-bold text-gray-900">
                  {riskScore.total_score}
                  <span className="text-sm font-medium text-gray-500 ml-1">
                    / {riskScore.max_possible_score}
                  </span>
                </p>
                <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-semibold">
                  {getRiskBand(riskScore.total_score, riskScore.max_possible_score)}
                </span>
                <span className="text-xs text-gray-500">
                  Last updated{" "}
                  {new Date(riskScore.calculated_at).toLocaleString("en-GB")}
                </span>
              </div>

              <div className="space-y-2">
                {Array.isArray(riskScore.score_breakdown) &&
                  riskScore.score_breakdown.map((item, idx) => (
                    <div
                      key={`${item.factor_slug}-${idx}`}
                      className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.factor}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.matchedCondition || "No match found"}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.score}/{item.maxPoints}
                      </p>
                    </div>
                  ))}
              </div>
            </>
          )}
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
