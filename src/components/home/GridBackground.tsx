
import { motion } from "framer-motion";

interface GridBackgroundProps {
  className?: string;
  gridSize?: number;
  opacity?: number;
  color?: string;
}

const GridBackground = ({
  className = "",
  gridSize = 40,
  opacity = 0.08,
  color = "#000"
}: GridBackgroundProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${color} ${opacity}%, transparent ${opacity}%),
            linear-gradient(to bottom, ${color} ${opacity}%, transparent ${opacity}%)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default GridBackground;
