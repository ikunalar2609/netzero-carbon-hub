
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const HomeHeader = () => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 bg-white z-50 py-4 px-6 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/2dd40c72-8b51-4483-b562-5b4b5bb78f7c.png" 
            alt="FarmlyCarbon Logo" 
            className="h-10 w-auto" 
          />
          <span className="text-xl font-bold">FarmlyCarbon</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="https://idlerwritingeveryday.substack.com" 
            className="font-bold hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Blog
          </Link>
          <Link 
            to="/dashboard" 
            className="font-bold hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Dashboard
          </Link>
          <Link 
            to="/login" 
            className="font-bold hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Login
          </Link>
        </nav>

        <div className="flex md:hidden">
          <Leaf className="h-6 w-6 text-primary" />
        </div>
      </div>
    </motion.header>
  );
};

export default HomeHeader;
