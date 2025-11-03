import { motion } from "framer-motion";

const metrics = [
  {
    number: "1.2M+",
    description: "tCO₂e tracked across agricultural operations with verified emission reductions",
    color: "text-blue-600"
  },
  {
    number: "235+",
    description: "verified carbon reduction projects spanning multiple continents and farm types",
    color: "text-blue-600"
  },
  {
    number: "50+",
    description: "global regions ranging from large-scale operations to local sustainable farms",
    color: "text-blue-600"
  },
  {
    number: "12",
    description: "data sources incl. NASA, IPCC, and NOAA for accurate climate modeling and tracking",
    color: "text-blue-600"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-medium text-[#1a1f71] mb-6">
                Our data in numbers
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                All of FarmlyCarbon's emission factors are compliant with the GHG Protocol and 
                expressed in CO2e (Carbon Dioxide Equivalent), taking into account Global Warming 
                Potential in 100 years (GWP 100).
              </p>
            </div>

            {/* Trust Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>GHG Protocol Compliant</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>IPCC Guidelines Certified</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Real-time Data Processing</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-t border-gray-200 pt-6"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <h3 className={`text-5xl md:text-6xl font-bold ${metric.color}`}>
                      {metric.number}
                    </h3>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-gray-600 leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
