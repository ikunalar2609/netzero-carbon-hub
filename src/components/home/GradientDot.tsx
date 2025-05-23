
import { motion } from "framer-motion";

interface GradientDotProps {
  className?: string;
  size?: number;
  x: string;
  y: string;
  color?: string;
  opacity?: number;
}

const GradientDot = ({
  className = "",
  size = 300,
  x,
  y,
  color = "rgba(0, 0, 0, 0.03)",
  opacity = 1
}: GradientDotProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 2 }}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        zIndex: -1,
      }}
    />
  );
};

export default GradientDot;
