import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lock,
  Mail,
  Leaf,
  ArrowRight,
  BarChart3,
  Globe,
  Shield,
  Zap,
  User,
  Phone,
} from "lucide-react";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Japan", "Brazil", "South Africa",
  "China", "Singapore", "UAE", "Netherlands", "Sweden",
  "Norway", "Denmark", "Finland", "Switzerland", "New Zealand",
  "Mexico", "Indonesia", "Thailand", "South Korea", "Italy",
  "Spain", "Portugal", "Ireland", "Belgium", "Austria",
];

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  mobile: z.string().min(6, "Valid mobile number required").max(20),
  country: z.string().min(1, "Country is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type Tab = "signin" | "signup" | "forgot";

const Login = () => {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("signin");
  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", mobile: "", country: "", email: "", password: "", confirmPassword: "" },
  });

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError("");
    try {
      await login(values.email, values.password);
      navigate("/farmly");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    setError("");
    try {
      await signup(values.firstName, values.lastName, values.email, values.password, values.mobile, values.country);
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onForgot = async (values: z.infer<typeof forgotSchema>) => {
    setIsLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent! Check your email.");
      setTab("signin");
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error("Google sign-in failed");
    }
  };

  const GoogleButton = () => (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[12px] font-semibold transition-all flex items-center justify-center gap-2.5"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );

  const Divider = () => (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-[10px]">
        <span className="bg-white px-3 text-gray-400 uppercase tracking-wider font-medium">or</span>
      </div>
    </div>
  );

  const InputField = ({ icon: Icon, label, error: fieldError, ...props }: any) => (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />}
        <Input className={`${Icon ? "pl-10" : ""} h-10 rounded-lg border-gray-200 text-[13px] focus:border-[#4338CA] focus:ring-[#4338CA]/20`} {...props} />
      </div>
      {fieldError && <p className="text-[10px] text-red-500 mt-1">{fieldError}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-[#4338CA] relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-10 w-40 h-40 bg-white/[0.03] rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[22px] font-extrabold text-white tracking-tight">
              Farmly<span className="text-emerald-300">Carbon</span>
            </span>
          </div>
          <p className="text-[13px] text-indigo-200/70 mt-1 max-w-[280px]">
            Enterprise carbon accounting & emissions intelligence platform
          </p>
        </div>

        <div className="relative z-10 space-y-5">
          {[
            { icon: BarChart3, title: "Real-time Analytics", desc: "Track emissions across Scope 1, 2 & 3 with live dashboards" },
            { icon: Globe, title: "Global EF Database", desc: "55+ emission factors from DEFRA, EPA, ICAO, IMO & ecoinvent" },
            { icon: Shield, title: "Compliance Ready", desc: "Aligned with GHG Protocol, ISO 14064, SBTi & CBAM" },
            { icon: Zap, title: "AI-Powered Insights", desc: "EF Agent & Decarbo Agent for smart recommendations" },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white">{title}</p>
                <p className="text-[11px] text-indigo-200/60 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-[10px] text-indigo-300/40 uppercase tracking-widest font-bold">
            Trusted by sustainability teams worldwide
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center bg-[#F8F9FC] px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#4338CA] flex items-center justify-center">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-[20px] font-extrabold text-gray-900 tracking-tight">
              Farmly<span className="text-[#4338CA]">Carbon</span>
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tabs */}
            {tab !== "forgot" && (
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => { setTab("signin"); setError(""); }}
                  className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-wider transition-colors ${
                    tab === "signin" ? "text-[#4338CA] border-b-2 border-[#4338CA]" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setTab("signup"); setError(""); }}
                  className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-wider transition-colors ${
                    tab === "signup" ? "text-[#4338CA] border-b-2 border-[#4338CA]" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Create Workspace
                </button>
              </div>
            )}

            {/* Header */}
            <div className="px-7 pt-6 pb-0">
              <h1 className="text-[20px] font-extrabold text-gray-900 tracking-tight">
                {tab === "signin" ? "Welcome back" : tab === "signup" ? "Create your workspace" : "Reset password"}
              </h1>
              <p className="text-[12px] text-gray-400 mt-1">
                {tab === "signin" ? "Sign in to your workspace" : tab === "signup" ? "Set up your FarmlyCarbon workspace" : "Enter your email to receive a reset link"}
              </p>
            </div>

            {/* Sign In Form */}
            {tab === "signin" && (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="px-7 pt-5 pb-7 space-y-4">
                {error && <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[11px] font-medium text-red-600">{error}</div>}
                <InputField icon={Mail} label="Email" placeholder="you@company.com" {...loginForm.register("email")} error={loginForm.formState.errors.email?.message} />
                <InputField icon={Lock} label="Password" type="password" placeholder="••••••••" {...loginForm.register("password")} error={loginForm.formState.errors.password?.message} />
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setTab("forgot"); setError(""); }} className="text-[11px] text-[#4338CA] font-semibold hover:underline">
                    Forgot password?
                  </button>
                </div>
                <button type="submit" disabled={isLoading} className="w-full h-10 rounded-lg bg-[#4338CA] hover:bg-[#3730A3] text-white text-[12px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60">
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>SIGN IN <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
                <Divider />
                <GoogleButton />
              </form>
            )}

            {/* Sign Up Form */}
            {tab === "signup" && (
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="px-7 pt-5 pb-7 space-y-3">
                {error && <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[11px] font-medium text-red-600">{error}</div>}
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={User} label="First Name" placeholder="John" {...signupForm.register("firstName")} error={signupForm.formState.errors.firstName?.message} />
                  <InputField label="Last Name" placeholder="Doe" {...signupForm.register("lastName")} error={signupForm.formState.errors.lastName?.message} />
                </div>
                <InputField icon={Mail} label="Email" placeholder="you@company.com" {...signupForm.register("email")} error={signupForm.formState.errors.email?.message} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={Phone} label="Mobile" placeholder="+91..." {...signupForm.register("mobile")} error={signupForm.formState.errors.mobile?.message} />
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Country</label>
                    <Select onValueChange={(val) => signupForm.setValue("country", val)} defaultValue="">
                      <SelectTrigger className="h-10 rounded-lg border-gray-200 text-[13px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {signupForm.formState.errors.country && <p className="text-[10px] text-red-500 mt-1">{signupForm.formState.errors.country.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={Lock} label="Password" type="password" placeholder="••••••" {...signupForm.register("password")} error={signupForm.formState.errors.password?.message} />
                  <InputField icon={Lock} label="Confirm" type="password" placeholder="••••••" {...signupForm.register("confirmPassword")} error={signupForm.formState.errors.confirmPassword?.message} />
                </div>
                <button type="submit" disabled={isLoading} className="w-full h-10 rounded-lg bg-[#4338CA] hover:bg-[#3730A3] text-white text-[12px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60">
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>CREATE WORKSPACE <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
                <Divider />
                <GoogleButton />
              </form>
            )}

            {/* Forgot Password Form */}
            {tab === "forgot" && (
              <form onSubmit={forgotForm.handleSubmit(onForgot)} className="px-7 pt-5 pb-7 space-y-4">
                {error && <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[11px] font-medium text-red-600">{error}</div>}
                <InputField icon={Mail} label="Email" placeholder="you@company.com" {...forgotForm.register("email")} error={forgotForm.formState.errors.email?.message} />
                <button type="submit" disabled={isLoading} className="w-full h-10 rounded-lg bg-[#4338CA] hover:bg-[#3730A3] text-white text-[12px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60">
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>SEND RESET LINK <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
                <button type="button" onClick={() => { setTab("signin"); setError(""); }} className="w-full text-[11px] text-[#4338CA] font-semibold hover:underline mt-2">
                  ← Back to sign in
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-[10px] text-gray-300 mt-5 uppercase tracking-widest font-medium">
            Powered by FarmlyCarbon Engine
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
