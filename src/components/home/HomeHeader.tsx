import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, BarChart3, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import farmlyLogo from "@/assets/farmly-carbon-logo.png";

const HomeHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
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
            <Link to="/" className="flex items-center gap-2 group">
              <motion.img 
                src={farmlyLogo}
                alt="Farmly Carbon"
                className="h-10 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
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
                className="flex items-center gap-2 font-semibold transition-colors duration-300"
                style={{ color: 'hsl(var(--text-secondary))' }}
                target="_blank" 
                rel="noopener noreferrer"
                onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--brand-primary))'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--text-secondary))'}
              >
                <span>Blog</span>
                <ExternalLink className="h-4 w-4 opacity-60" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Link 
                to="/farmly" 
                className="flex items-center gap-2 font-semibold transition-colors duration-300"
                style={{ color: 'hsl(var(--text-secondary))' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--brand-primary))'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--text-secondary))'}
              >
                <span>Farmly API</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Link 
                to="/maps" 
                className="flex items-center gap-2 font-semibold transition-colors duration-300"
                style={{ color: 'hsl(var(--text-secondary))' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--brand-primary))'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--text-secondary))'}
              >
                <span>Maps</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 font-semibold transition-colors duration-300"
                style={{ color: 'hsl(var(--text-secondary))' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--brand-primary))'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--text-secondary))'}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="text-white shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ 
                  backgroundImage: 'var(--gradient-cta)',
                }}
              >
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Get Started</span>
                </Link>
              </Button>
            </motion.div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'hsl(var(--text-primary))' }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden bg-white/95 backdrop-blur-lg border-b shadow-lg"
          >
            <nav className="flex flex-col p-6 gap-4">
              <Link 
                to="https://idlerwritingeveryday.substack.com" 
                className="flex items-center gap-2 font-semibold py-3 px-4 rounded-lg transition-colors"
                style={{ color: 'hsl(var(--text-secondary))' }}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Blog</span>
                <ExternalLink className="h-4 w-4 opacity-60" />
              </Link>
              
              <Link 
                to="/farmly" 
                className="flex items-center gap-2 font-semibold py-3 px-4 rounded-lg transition-colors"
                style={{ color: 'hsl(var(--text-secondary))' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Farmly</span>
              </Link>
              
              <Link 
                to="/maps" 
                className="flex items-center gap-2 font-semibold py-3 px-4 rounded-lg transition-colors"
                style={{ color: 'hsl(var(--text-secondary))' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Maps</span>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 font-semibold py-3 px-4 rounded-lg transition-colors"
                style={{ color: 'hsl(var(--text-secondary))' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              <Button
                asChild
                className="text-white mt-2"
                style={{ backgroundImage: 'var(--gradient-cta)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/login" className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Get Started</span>
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomeHeader;
