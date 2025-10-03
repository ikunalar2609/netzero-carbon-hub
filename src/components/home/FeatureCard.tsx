import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  badgeColor: string;
  badgeBg: string;
  borderHoverColor: string;
  delay?: number;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  badge,
  gradientFrom,
  gradientTo,
  glowColor,
  badgeColor,
  badgeBg,
  borderHoverColor,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group relative"
    >
      {/* Animated glow effect on hover */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-[28px] opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
      ></div>

      <div className={`relative bg-white rounded-[26px] p-10 border border-gray-100 hover:${borderHoverColor} shadow-sm hover:shadow-2xl hover:${glowColor} transition-all duration-500 h-full flex flex-col`}>
        {/* Enhanced icon container with layered gradients */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative w-20 h-20 mb-8"
        >
          {/* Base gradient layer */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-[20px] shadow-lg ${glowColor}`}></div>
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 rounded-[20px]"></div>
          {/* Icon */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Icon className="h-9 w-9 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Content */}
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          {title}
        </h3>
        <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
          {description}
        </p>

        {/* Badge */}
        <div className="pt-4 border-t border-gray-100">
          <span
            className={`inline-flex items-center text-sm font-medium ${badgeColor} ${badgeBg} px-4 py-2 rounded-full`}
          >
            {badge}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
