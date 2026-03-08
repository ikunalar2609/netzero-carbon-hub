import { motion } from "framer-motion";
import { CheckCircle2, LayoutDashboard, Terminal, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const leftFeatures = [
  "Stop spending weeks sourcing and verifying emission factors",
  "Integrate carbon data into existing workflows and spreadsheets",
  "Focus on climate action, not data wrestling",
];

const rightFeatures = [
  "Access verified carbon data through our REST API",
  "Eliminate the cost of manual emission data management",
  "Help customers measure emissions and reduce risk",
];

export const ToolsShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left - Professionals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-50 px-8 md:px-16 py-20 md:py-28 flex flex-col justify-center"
        >
          <div className="max-w-lg">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                <LayoutDashboard className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">
                Measure & Report
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-10 leading-tight">
              For sustainability<br />professionals
            </h2>

            <div className="space-y-5 mb-10">
              {leftFeatures.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[15px] text-gray-600 leading-relaxed">{f}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-gray-900 hover:text-emerald-700 transition-colors"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Right - Developers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-900 px-8 md:px-16 py-20 md:py-28 flex flex-col justify-center"
        >
          <div className="max-w-lg">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Terminal className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">
                Build & Integrate
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-10 leading-tight">
              For technical<br />teams
            </h2>

            <div className="space-y-5 mb-10">
              {rightFeatures.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[15px] text-gray-300 leading-relaxed">{f}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/farmly")}
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Explore Farmly API
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
