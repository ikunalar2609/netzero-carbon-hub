
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Leaf } from "lucide-react";
import { useState } from "react";

const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Blog", href: "https://idlerwritingeveryday.substack.com", external: true },
    { name: "Dashboard", href: "/dashboard", external: false },
    { name: "Login", href: "/login", external: false }
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 shadow-lg border-b border-gray-100"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Leaf className="h-8 w-8 text-primary group-hover:text-primary/80 transition-all duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                FarmlyCarbon
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative font-semibold text-gray-700 hover:text-primary transition-all duration-300 group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 group-hover:w-full transition-all duration-300" />
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="relative font-semibold text-gray-700 hover:text-primary transition-all duration-300 group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 group-hover:w-full transition-all duration-300" />
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 border-t border-gray-100 mt-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: isMenuOpen ? 0 : -20, opacity: isMenuOpen ? 1 : 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-semibold text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="block font-semibold text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default HomeHeader;
