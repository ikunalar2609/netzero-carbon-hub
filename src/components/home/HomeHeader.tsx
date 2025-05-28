
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, BarChart3, LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomeHeader = () => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg z-50 py-4 px-6 border-b border-white/30 shadow-xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/" className="flex items-center gap-3 group">
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              FarmlyCarbon
            </motion.span>
          </Link>
        </motion.div>
        
        <motion.nav 
          className="hidden md:flex items-center gap-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link 
              to="https://idlerwritingeveryday.substack.com" 
              className="flex items-center gap-2 font-semibold text-gray-700 hover:text-green-600 relative group transition-colors duration-300"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span>Blog</span>
              <ExternalLink className="h-4 w-4 opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 font-semibold text-gray-700 hover:text-green-600 relative group transition-colors duration-300"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Get Started</span>
              </Link>
            </Button>
          </motion.div>
        </motion.nav>

        <div className="flex md:hidden">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default HomeHeader;
