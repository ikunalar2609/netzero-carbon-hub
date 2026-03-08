import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Database, Zap, ChevronRight, Globe, Shield, BarChart3, Leaf } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import HomeHeader from "@/components/home/HomeHeader";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ToolsShowcase } from "@/components/home/ToolsShowcase";
import farmlyApiVideo from "@/assets/farmly-api-video.webm";
import farmHeroBg from "@/assets/farm-hero-bg.jpg";
import nasaLogo from "@/assets/logos/nasa-logo.svg";
import ipccLogo from "@/assets/logos/ipcc-logo.png";
import noaaLogo from "@/assets/logos/noaa-logo.png";
import sbtiLogo from "@/assets/logos/sbti-logo.png";
import oxfordLogo from "@/assets/logos/oxford-logo.png";
import carbonIntegrityLogo from "@/assets/logos/carbon-integrity-logo.png";
import wwfLogo from "@/assets/logos/wwf-logo.png";
import goldStandardLogo from "@/assets/logos/gold-standard-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white antialiased">
      <HomeHeader />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${farmHeroBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-24 pb-20">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Agricultural Carbon Platform
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.05] mb-6"
          >
            Measure, reduce &
            <br />
            <span className="text-emerald-600">offset carbon</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The all-in-one platform for agricultural carbon management.
            Track emissions, plan net-zero pathways, and access verified carbon markets.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="h-12 px-7 text-[14px] font-semibold rounded-xl bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/10 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/farmly")}
              className="h-12 px-7 text-[14px] font-semibold rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Explore Platform
            </Button>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-gray-400"
          >
            <span className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" /> SOC 2 Compliant
            </span>
            <span className="flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5" /> 1.2M+ tCO₂e tracked
            </span>
            <span className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" /> 50+ regions
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <FeaturesSection />

      {/* ═══════════════ TOOLS SHOWCASE ═══════════════ */}
      <ToolsShowcase />

      {/* ═══════════════ API SECTION ═══════════════ */}
      <section className="py-28 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-emerald-600 mb-3 block">
                Developer Tools
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-[1.1] mb-5">
                Powerful Farmly API
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-10">
                Integrate accurate carbon calculations directly into your applications
                with our RESTful API. Built for scale, designed for simplicity.
              </p>

              <div className="flex items-center gap-6 mb-10">
                {[
                  { icon: Zap, label: "< 50ms", sub: "Response time" },
                  { icon: Code2, label: "REST", sub: "API standard" },
                  { icon: Database, label: "10K+", sub: "Emission factors" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <item.icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="text-[14px] font-bold text-gray-900">{item.label}</div>
                    <div className="text-[11px] text-gray-400">{item.sub}</div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/farmly/docs")}
                className="h-12 px-7 text-[14px] font-semibold rounded-xl bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/10 group"
              >
                View API Docs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Video */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/50 bg-white">
                <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 px-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                </div>
                <video
                  src={farmlyApiVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>

          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-8">
              Data Powered By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {[
                { src: nasaLogo, alt: "NASA" },
                { src: ipccLogo, alt: "IPCC" },
                { src: noaaLogo, alt: "NOAA" },
              ].map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-12 md:h-14 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ STANDARDS ═══════════════ */}
      <section className="py-28 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-emerald-600 mb-3 block">
                Standards & Compliance
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-[1.1] mb-5">
                Science-backed<br />credibility
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                Base your climate strategy on credible science, not guesswork.
                Align carbon offsetting with robust standards that fit your goals, budget, and impact targets.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { src: ipccLogo, name: "IPCC 1.5°C" },
                { src: sbtiLogo, name: "SBTi Net Zero" },
                { src: oxfordLogo, name: "Oxford Principles" },
                { src: carbonIntegrityLogo, name: "Carbon Integrity" },
                { src: wwfLogo, name: "WWF" },
                { src: goldStandardLogo, name: "Gold Standard" },
              ].map((std) => (
                <div
                  key={std.name}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-14 h-14 flex items-center justify-center">
                    <img src={std.src} alt={std.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 text-center leading-tight">
                    {std.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BOOKING ═══════════════ */}
      <section className="py-28 px-4 md:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-emerald-600 mb-3 block">
              Book a Demo
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Let's connect
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Whether it's about ideas, collaborations, or exploring FarmlyCarbon for your organization — pick a time that works.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-100/50 overflow-hidden">
              <iframe
                src="https://cal.com/kunal-rahangdale-8dbab0/30min?overlayCalendar=true"
                width="100%"
                height="680"
                style={{ border: "none" }}
                allow="fullscreen"
                title="Schedule a meeting"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-28 px-4 md:px-8 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to transform your
            <br />
            <span className="text-emerald-400">carbon footprint?</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join leading agricultural operations worldwide who trust FarmlyCarbon
            to drive sustainability and unlock new revenue streams.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="h-12 px-8 text-[14px] font-semibold rounded-xl bg-white text-gray-900 hover:bg-gray-100 shadow-lg group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/farmly")}
              className="h-12 px-8 text-[14px] font-semibold rounded-xl border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
            >
              Explore Platform
            </Button>
          </div>

          <div className="mt-14 flex items-center justify-center gap-8 text-[13px] text-gray-500">
            <span>Enterprise Ready</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>SOC 2 Compliant</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>99.9% Uptime</span>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-white border-t border-gray-100 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-emerald-600" />
                <span className="text-[16px] font-bold text-gray-900">FarmlyCarbon</span>
              </Link>
              <p className="text-[13px] text-gray-400 leading-relaxed max-w-xs">
                Empowering agricultural operations with comprehensive carbon management for a sustainable future.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-[12px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-4">Platform</h4>
              <div className="space-y-3">
                <Link to="/farmly" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Farmly CAT</Link>
                <Link to="/maps" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Maps</Link>
                <Link to="/dashboard" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
                <Link to="/farmly/docs" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">API Docs</Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[12px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-4">Resources</h4>
              <div className="space-y-3">
                <a href="https://idlerwritingeveryday.substack.com" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Blog</a>
                <Link to="/login" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Log in</Link>
                <Link to="/signup" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Sign Up</Link>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-[12px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-4">Connect</h4>
              <div className="space-y-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">LinkedIn</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Instagram</a>
                <span className="block text-[13px] text-gray-400">i.kunal.ar26@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-gray-400">© 2025 FarmlyCarbon. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">Terms</a>
              <a href="#" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
