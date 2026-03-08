import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, LogIn, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import farmlyLogo from "@/assets/farmly-carbon-logo.png";

const navLinks = [
  { label: "Product", to: "/farmly" },
  { label: "Maps", to: "/maps" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Docs", to: "/farmly/docs" },
  { label: "Blog", to: "https://idlerwritingeveryday.substack.com", external: true },
];

const HomeHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={farmlyLogo} alt="FarmlyCarbon" className="h-9 w-auto" />
            <span className="text-[17px] font-bold tracking-tight text-gray-900 hidden sm:block">
              FarmlyCarbon
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="px-3.5 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-1"
              >
                {link.label}
                {link.external && <ExternalLink className="h-3 w-3 opacity-40" />}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              to="/login"
              className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Button
              asChild
              size="sm"
              className="rounded-lg px-4 h-9 text-[13px] font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
            >
              <Link to="/signup">
                Get Started
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-white border-b border-gray-100 shadow-lg"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="px-4 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.external && <ExternalLink className="h-3.5 w-3.5 opacity-40" />}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-3 flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 text-center px-4 py-2.5 text-[13px] font-medium text-gray-700 border border-gray-200 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center px-4 py-2.5 text-[13px] font-semibold text-white bg-gray-900 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomeHeader;
