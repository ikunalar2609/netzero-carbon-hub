
import { motion } from "framer-motion";

interface GridBackgroundProps {
  className?: string;
  gridSize?: number;
  opacity?: number;
  color?: string;
  backgroundImage?: string;
}

const GridBackground = ({
  className = "",
  gridSize = 40,
  opacity = 0.08,
  color = "#000",
  backgroundImage
}: GridBackgroundProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-full h-full"
        style={{
          backgroundImage: backgroundImage 
            ? `url(${backgroundImage}), 
               linear-gradient(to right, ${color} ${opacity}%, transparent ${opacity}%),
               linear-gradient(to bottom, ${color} ${opacity}%, transparent ${opacity}%)`
            : `linear-gradient(to right, ${color} ${opacity}%, transparent ${opacity}%),
               linear-gradient(to bottom, ${color} ${opacity}%, transparent ${opacity}%)`,
          backgroundSize: `${backgroundImage ? 'cover, ' : ''}${gridSize}px ${gridSize}px`,
          backgroundBlendMode: backgroundImage ? 'overlay, normal' : 'normal',
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default GridBackground;
