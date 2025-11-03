import { motion } from "framer-motion";
import { CheckCircle2, LayoutDashboard, Terminal, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ToolsShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Left Side - For Sustainability Professionals */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[hsl(236,70%,92%)] px-8 md:px-16 py-16 md:py-24 flex flex-col justify-center"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <LayoutDashboard className="h-8 w-8 text-[hsl(236,70%,40%)]" />
              <span className="text-[hsl(236,70%,40%)] font-semibold uppercase tracking-wider text-sm">
                MEASURE & REPORT
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light text-[hsl(236,70%,20%)] mb-12">
              For sustainability professionals
            </h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-[hsl(236,70%,40%)] flex-shrink-0 mt-1" />
                <p className="text-[hsl(236,70%,30%)] text-lg leading-relaxed">
                  Stop spending weeks sourcing, managing, and verifying emission factors
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-[hsl(236,70%,40%)] flex-shrink-0 mt-1" />
                <p className="text-[hsl(236,70%,30%)] text-lg leading-relaxed">
                  Quickly integrate Climatiq data into your existing workflows and spreadsheets
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-[hsl(236,70%,40%)] flex-shrink-0 mt-1" />
                <p className="text-[hsl(236,70%,30%)] text-lg leading-relaxed">
                  Focus on climate action, not data wrestling
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/dashboard")}
              className="group inline-flex items-center gap-2 text-[hsl(236,70%,40%)] font-medium text-lg hover:gap-4 transition-all duration-300"
            >
              FarmlyCarbon Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Right Side - For Technical Teams */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-[hsl(236,70%,10%)] px-8 md:px-16 py-16 md:py-24 flex flex-col justify-center"
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="h-8 w-8 text-white" />
              <span className="text-white font-semibold uppercase tracking-wider text-sm">
                BUILD & INTEGRATE
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-light text-white mb-12">
              For technical teams
            </h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                <p className="text-gray-200 text-lg leading-relaxed">
                  Access verified carbon data through our REST API
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                <p className="text-gray-200 text-lg leading-relaxed">
                  Eliminate the cost and complexity of manual emission data management
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0 mt-1" />
                <p className="text-gray-200 text-lg leading-relaxed">
                  Help customers measure their emissions and reduce risk
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/farmly")}
              className="group inline-flex items-center gap-2 text-white font-medium text-lg hover:gap-4 transition-all duration-300"
            >
              Farmly API for developers
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
