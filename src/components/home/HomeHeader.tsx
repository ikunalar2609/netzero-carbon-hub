import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import farmlyLogo from "@/assets/farmly-carbon-logo.png";

const navLinks = [
  { label: "Product", to: "/farmly" },
  { label: "Maps & Charts", to: "/maps" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={farmlyLogo} alt="FarmlyCarbon" className="h-8 w-auto" />
            <span className="text-[16px] font-bold tracking-tight text-foreground hidden sm:block">
              FarmlyCarbon
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-all duration-200"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-all duration-200"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <Link
              to="/login"
              className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-background border-b border-border shadow-lg"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 text-[14px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="px-4 py-3 text-[14px] font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="border-t border-border mt-2 pt-3">
                <Link
                  to="/login"
                  className="block text-center px-4 py-2.5 text-[13px] font-medium text-foreground border border-border rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
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
