import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
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
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
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
