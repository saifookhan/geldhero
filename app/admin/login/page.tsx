"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "signup";

export default function AdminAuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // signup-only validation
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
          return;
        }
        if (data.user)
          await supabase.auth.updateUser({ data: { role: "admin" } });
        router.push("/admin/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: "admin" } },
        });
        if (error) {
          setError(error.message);
          return;
        }
        if (data.user && !data.session) {
          // email confirmation required
          setSuccess(
            "Account created! Check your email to confirm before signing in.",
          );
        } else {
          router.push("/admin/dashboard");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
    setSuccess("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <Link href="/" className="flex justify-center">
            <span className="text-3xl font-bold text-primary">
              GeldHero Admin
            </span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === "login" ? "Admin sign in" : "Create admin account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === "login"
              ? "Use your admin credentials to access the dashboard."
              : "Register a new admin account."}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => mode !== "login" && switchMode()}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-primary text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => mode !== "signup" && switchMode()}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "signup"
                ? "bg-primary text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm password — signup only */}
          {mode === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </Button>
        </form>

        {/* Footer switch */}
        <p className="text-center text-sm text-gray-500">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="text-primary font-medium hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
