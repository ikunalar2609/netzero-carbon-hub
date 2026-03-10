import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Lock, Leaf, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Check URL hash for recovery token
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-7 text-center space-y-4">
            <div className="flex items-center gap-2 justify-center mb-4">
              <span className="text-[20px] font-extrabold text-gray-900 tracking-tight">
                Farmly<span className="text-[#4338CA]">Carbon</span>
              </span>
            </div>
            <p className="text-[13px] text-gray-500">Invalid or expired reset link. Please request a new one.</p>
            <button onClick={() => navigate("/login")} className="text-[12px] text-[#4338CA] font-semibold hover:underline">
              ← Back to sign in
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC] px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 rounded-lg bg-[#4338CA] flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-[20px] font-extrabold text-gray-900 tracking-tight">
            Farmly<span className="text-[#4338CA]">Carbon</span>
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-7 pt-7 pb-0">
            <h1 className="text-[20px] font-extrabold text-gray-900 tracking-tight">Set new password</h1>
            <p className="text-[12px] text-gray-400 mt-1">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="px-7 pt-6 pb-7 space-y-4">
            {error && <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[11px] font-medium text-red-600">{error}</div>}

            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-10 rounded-lg border-gray-200 text-[13px] focus:border-[#4338CA] focus:ring-[#4338CA]/20" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-10 rounded-lg border-gray-200 text-[13px] focus:border-[#4338CA] focus:ring-[#4338CA]/20" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full h-10 rounded-lg bg-[#4338CA] hover:bg-[#3730A3] text-white text-[12px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60">
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>UPDATE PASSWORD <ArrowRight className="h-3.5 w-3.5" /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
