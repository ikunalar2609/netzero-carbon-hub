import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const metrics = [
  { number: "1.2M+", label: "tCO₂e Tracked", desc: "Verified emission reductions across agricultural operations" },
  { number: "235+", label: "Carbon Projects", desc: "Spanning multiple continents and farm types" },
  { number: "50+", label: "Global Regions", desc: "From large-scale operations to local sustainable farms" },
  { number: "12", label: "Data Sources", desc: "Including NASA, IPCC, and NOAA for accurate modeling" },
];

export const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-20"
        >
          <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-emerald-600 mb-3 block">
            Platform Metrics
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-[1.1] mb-5">
            Built on verified,<br />science-backed data
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            All emission factors are GHG Protocol compliant and expressed in CO₂e,
            accounting for Global Warming Potential over 100 years (GWP 100).
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 lg:p-10"
            >
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                {m.number}
              </div>
              <div className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                {m.label}
              </div>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Compliance badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {["GHG Protocol", "IPCC Guidelines", "ISO 14064", "SBTi Aligned"].map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1.5 text-[11px] font-semibold tracking-wide rounded-full bg-gray-50 text-gray-500 border border-gray-100"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
