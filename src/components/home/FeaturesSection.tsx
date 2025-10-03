import { motion } from "framer-motion";
import { BarChart3, Target, LineChart } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: BarChart3,
    title: "Track Emissions",
    description:
      "Monitor your farm's carbon footprint with real-time data analytics and actionable insights for immediate impact.",
    badge: "Real-time monitoring",
    gradientFrom: "from-green-400",
    gradientTo: "to-emerald-600",
    glowColor: "shadow-green-500/10",
    badgeColor: "text-green-600",
    badgeBg: "bg-green-50",
    borderHoverColor: "border-green-200/50",
    delay: 0.1,
  },
  {
    icon: Target,
    title: "Plan Reductions",
    description:
      "Create science-based, actionable strategies to reach your net-zero goals with our intelligent planning tools.",
    badge: "AI-powered insights",
    gradientFrom: "from-blue-400",
    gradientTo: "to-cyan-600",
    glowColor: "shadow-blue-500/10",
    badgeColor: "text-blue-600",
    badgeBg: "bg-blue-50",
    borderHoverColor: "border-blue-200/50",
    delay: 0.2,
  },
  {
    icon: LineChart,
    title: "Measure Progress",
    description:
      "Track improvements and maintain compliance with global sustainability standards and reporting frameworks.",
    badge: "Compliance ready",
    gradientFrom: "from-purple-400",
    gradientTo: "to-pink-600",
    glowColor: "shadow-purple-500/10",
    badgeColor: "text-purple-600",
    badgeBg: "bg-purple-50",
    borderHoverColor: "border-purple-200/50",
    delay: 0.3,
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 mb-6">
            Platform Features
          </span>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Everything you need to
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-medium">
              {" "}
              succeed
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Comprehensive carbon management platform designed for modern
            agriculture operations
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
