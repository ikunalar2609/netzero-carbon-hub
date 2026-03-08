import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { lovable } from "@/integrations/lovable/index";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  Leaf,
  ArrowRight,
  BarChart3,
  Globe,
  Shield,
  Zap,
} from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-[#4338CA] relative overflow-hidden flex-col justify-between p-10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-10 w-40 h-40 bg-white/[0.03] rounded-full" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-[22px] font-extrabold text-white tracking-tight">
              Farmly<span className="text-emerald-300">Carbon</span>
            </span>
          </div>
          <p className="text-[13px] text-indigo-200/70 mt-1 max-w-[280px]">
            Enterprise carbon accounting & emissions intelligence platform
          </p>
        </div>

        {/* Feature highlights */}
        <div className="relative z-10 space-y-5">
          {[
            { icon: BarChart3, title: "Real-time Analytics", desc: "Track emissions across Scope 1, 2 & 3 with live dashboards" },
            { icon: Globe, title: "Global EF Database", desc: "55+ emission factors from DEFRA, EPA, ICAO, IMO & ecoinvent" },
            { icon: Shield, title: "Compliance Ready", desc: "Aligned with GHG Protocol, ISO 14064, SBTi & CBAM" },
            { icon: Zap, title: "AI-Powered Insights", desc: "EF Agent & Decarbo Agent for smart recommendations" },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3"
            >
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

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-[10px] text-indigo-300/40 uppercase tracking-widest font-bold">
            Trusted by sustainability teams worldwide
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-[#F8F9FC] px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[400px]"
        >
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
            {/* Header */}
            <div className="px-7 pt-7 pb-0">
              <h1 className="text-[20px] font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
              <p className="text-[12px] text-gray-400 mt-1">Sign in to your workspace</p>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-7 pt-6 pb-7 space-y-4">
              {error && (
                <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[11px] font-medium text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <Input
                    placeholder="you@company.com"
                    className="pl-10 h-10 rounded-lg border-gray-200 text-[13px] focus:border-[#4338CA] focus:ring-[#4338CA]/20"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-[10px] text-red-500 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-10 rounded-lg border-gray-200 text-[13px] focus:border-[#4338CA] focus:ring-[#4338CA]/20"
                    {...form.register("password")}
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-[10px] text-red-500 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-[#4338CA] hover:bg-[#3730A3] text-white text-[12px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    SIGN IN
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-white px-3 text-gray-400 uppercase tracking-wider font-medium">or</span>
                </div>
              </div>

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
            </form>

            {/* Footer */}
            <div className="px-7 py-4 bg-gray-50/80 border-t border-gray-100 text-center">
              <span className="text-[11px] text-gray-400">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#4338CA] font-bold hover:underline">
                  Create workspace
                </Link>
              </span>
            </div>
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
