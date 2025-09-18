import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { Button } from "@/components/ui/button";

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={toggleDarkMode}
        variant="outline"
        size="sm"
        className="rounded-full p-3 bg-background border-border hover:bg-accent"
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDarkMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 text-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
};