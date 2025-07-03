import { motion } from "framer-motion";
import { Loader2, Leaf } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 20px 20px'
             }} />
      </div>

      {/* Large Circular Wireframe */}
      <motion.div
        className="absolute w-[600px] h-[600px] border border-white/20 rounded-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1, 0.8], 
          opacity: [0, 0.5, 0],
          rotate: 360 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      {/* Medium Circular Wireframe */}
      <motion.div
        className="absolute w-[400px] h-[400px] border border-white/15 rounded-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: [0.9, 1.1, 0.9], 
          opacity: [0, 0.3, 0],
          rotate: -360 
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Small Circular Wireframe */}
      <motion.div
        className="absolute w-[200px] h-[200px] border border-white/10 rounded-full"
        initial={{ scale: 1, opacity: 0 }}
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0, 0.4, 0],
          rotate: 360 
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Floating Dots */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/30 rounded-full"
        animate={{ 
          y: [-10, 10, -10],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-white/20 rounded-full"
        animate={{ 
          y: [10, -10, 10],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mr-4 p-3 rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 backdrop-blur-sm border border-white/10"
          >
            <Leaf className="h-8 w-8 text-green-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
            FarmlyCarbon
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-white/90">
            Initializing your
          </h2>
          <h2 className="text-2xl md:text-3xl font-light text-white/90">
            sustainability platform
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center space-x-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-6 w-6 text-green-400" />
          </motion.div>
          <span className="text-white/70 text-lg">Loading...</span>
        </motion.div>

        {/* Progress Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 space-y-3"
        >
          <div className="flex justify-center space-x-6 text-sm text-white/50">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Setting up dashboard</span>
            </motion.div>
          </div>
          
          <div className="flex justify-center space-x-6 text-sm text-white/50">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              className="flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Loading carbon data</span>
            </motion.div>
          </div>
          
          <div className="flex justify-center space-x-6 text-sm text-white/50">
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
              className="flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span>Preparing analytics</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Ambient Light Effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-green-500/5 via-transparent to-transparent rounded-full pointer-events-none" />
    </div>
  );
};

export default LoadingPage;