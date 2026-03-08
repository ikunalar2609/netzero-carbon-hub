import { motion } from "framer-motion";
import { CheckCircle2, BarChart3, Code2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sustainabilityFeatures = [
  "Automated GHG inventory reports",
  "Scope 1–3 categorization engine",
  "CSRD & CDP-ready exports",
];

const technicalFeatures = [
  "10,000+ verified emission factors",
  "Exposed across 6 GHG categories",
  "Region-specific & activity-based data",
];

export const ToolsShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
        {/* Left - Sustainability Teams */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-secondary/40 px-8 md:px-16 lg:px-20 py-20 md:py-28 flex flex-col justify-center"
        >
          <div className="max-w-md">
            <div className="w-11 h-11 rounded-xl bg-foreground/10 flex items-center justify-center mb-8">
              <BarChart3 className="h-5 w-5 text-foreground/80" />
            </div>

            <h2 className="text-3xl md:text-[40px] font-bold text-foreground mb-4 leading-[1.15] tracking-tight">
              For sustainability
              <br />
              teams
            </h2>

            <p className="text-[15px] text-foreground/60 leading-relaxed mb-10 max-w-sm">
              Streamline corporate carbon reporting. Automate Scope 1–3 data
              collection and generate compliance-ready reports in minutes.
            </p>

            <div className="space-y-4 mb-12">
              {sustainabilityFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="h-[18px] w-[18px] text-primary flex-shrink-0" />
                  <span className="text-[14px] font-medium text-foreground/80">{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/farmly")}
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-foreground hover:text-primary transition-colors"
            >
              Open Product
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Right - Technical Teams */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-[hsl(220,30%,14%)] px-8 md:px-16 lg:px-20 py-20 md:py-28 flex flex-col justify-center"
        >
          <div className="max-w-md">
            <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center mb-8">
              <Code2 className="h-5 w-5 text-primary" />
            </div>

            <h2 className="text-3xl md:text-[40px] font-bold text-white mb-4 leading-[1.15] tracking-tight">
              Benchmark
              <br />
              emission factors
            </h2>

            <p className="text-[15px] text-white/50 leading-relaxed mb-10 max-w-sm">
              Embed carbon intelligence into your products. Access verified
              emission factors through our API.
            </p>

            <div className="space-y-4 mb-12">
              {technicalFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="h-[18px] w-[18px] text-primary flex-shrink-0" />
                  <span className="text-[14px] font-medium text-white/75">{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/farmly/docs")}
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-primary hover:text-[hsl(var(--brand-primary-light))] transition-colors"
            >
              View API Docs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
