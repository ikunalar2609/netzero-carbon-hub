
import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface AnimatePresenceProps {
  children: React.ReactNode;
}

export const AnimatePresence: React.FC<AnimatePresenceProps> = ({ children }) => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname && wrapperRef.current) {
      // Add animation classes
      wrapperRef.current.classList.add("animate-fade-out");
      
      // Set timeout for animation duration
      const timeout = setTimeout(() => {
        if (wrapperRef.current) {
          wrapperRef.current.classList.remove("animate-fade-out");
          wrapperRef.current.classList.add("animate-fade-in");
          
          // Clear the fade-in class after animation completes
          setTimeout(() => {
            if (wrapperRef.current) {
              wrapperRef.current.classList.remove("animate-fade-in");
            }
          }, 300);
        }
      }, 300);
      
      prevPathRef.current = location.pathname;
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  return (
    <div ref={wrapperRef} className="min-h-screen transition-opacity duration-300">
      {children}
    </div>
  );
};
