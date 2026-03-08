import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Database, Zap, Globe, Shield, BarChart3, Leaf, Play, CheckCircle2, Plane, Ship, Truck, Calculator, FileSpreadsheet, Bot, MapPin, Flame } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import HomeHeader from "@/components/home/HomeHeader";
import farmlyApiVideo from "@/assets/farmly-api-video.webm";
import heroVisual from "@/assets/hero-visual.png";
import nasaLogo from "@/assets/logos/nasa-logo.svg";
import ipccLogo from "@/assets/logos/ipcc-logo.png";
import noaaLogo from "@/assets/logos/noaa-logo.png";
import sbtiLogo from "@/assets/logos/sbti-logo.png";
import oxfordLogo from "@/assets/logos/oxford-logo.png";
import carbonIntegrityLogo from "@/assets/logos/carbon-integrity-logo.png";
import wwfLogo from "@/assets/logos/wwf-logo.png";
import goldStandardLogo from "@/assets/logos/gold-standard-logo.png";
import farmlyLogo from "@/assets/farmly-carbon-logo.png";
import farmlyDashboardScreenshot from "@/assets/farmly-dashboard-screenshot.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background antialiased overflow-x-hidden">
      <HomeHeader />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--green-100)),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_80%_50%,hsl(var(--green-50))/0.5,transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
                <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 mb-8 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Now in Public Beta
                </span>
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl md:text-[68px] font-bold text-foreground tracking-[-0.03em] leading-[1.05] mb-6"
              >
                Carbon management
                <br />
                <span className="bg-gradient-to-r from-primary to-[hsl(var(--brand-primary-light))] bg-clip-text text-transparent">
                  for enterprises
                </span>
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-lg md:text-xl text-foreground/85 max-w-xl mb-10 leading-relaxed"
              >
                Track Scope 1–3 emissions, plan net-zero pathways, and access verified carbon markets.
                The all-in-one platform trusted by corporations and sustainability teams worldwide.
              </motion.p>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/signup")}
                  className="h-13 px-8 text-[15px] font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-foreground/10 transition-all hover:shadow-2xl hover:-translate-y-0.5 group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/farmly")}
                  className="h-13 px-8 text-[15px] font-semibold rounded-xl border-border text-foreground hover:bg-secondary transition-all"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Live Demo
                </Button>
              </motion.div>

              {/* Social proof row */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-12 flex flex-wrap items-center gap-6 text-[13px] text-foreground/70"
              >
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> SOC 2 Compliant
                </span>
                <span className="h-4 w-px bg-border" />
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> 1.2M+ tCO₂e tracked
                </span>
                <span className="h-4 w-px bg-border" />
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> 50+ regions
                </span>
              </motion.div>
            </div>

            {/* Right: Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block relative"
            >
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-3xl blur-3xl pointer-events-none" />
              <img
                src={heroVisual}
                alt="FarmlyCarbon carbon data visualization with charts and analytics"
                className="relative w-full h-auto rounded-2xl shadow-2xl shadow-foreground/10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ LOGO STRIP ═══════════════ */}
      <section className="py-16 px-6 border-y border-border bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/60 text-center mb-8">
            Data Powered By Leading Institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {[
              { src: nasaLogo, alt: "NASA" },
              { src: ipccLogo, alt: "IPCC" },
              { src: noaaLogo, alt: "NOAA" },
              { src: sbtiLogo, alt: "SBTi" },
              { src: goldStandardLogo, alt: "Gold Standard" },
            ].map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-8 md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRODUCT SHOWCASE ═══════════════ */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-4 block">
              Product
            </span>
            <h2 className="text-4xl md:text-[52px] font-bold text-foreground tracking-tight leading-[1.1] mb-5">
              The carbon calculator
              <br />
              built for precision
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Six calculation methodologies, 10,000+ emission factors, AI-powered agents, and 
              interactive sustainability insights — all in one workspace.
            </p>
          </motion.div>

          {/* Dashboard Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative mb-20"
          >
            <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />
            
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-foreground/10 bg-card">
              <div className="h-10 bg-secondary border-b border-border flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/30" />
                  <div className="w-3 h-3 rounded-full bg-[hsl(45,80%,55%)]/40" />
                  <div className="w-3 h-3 rounded-full bg-primary/30" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background/80 border border-border rounded-md px-4 py-1 text-[11px] text-foreground/50 font-mono">
                    app.farmlycarbon.in/calculator
                  </div>
                </div>
              </div>
              <img
                src={farmlyDashboardScreenshot}
                alt="FarmlyCarbon Calculator Dashboard — Transport, Flight, Sea, Energy emission calculations with filters and sustainability insights"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Feature pills row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20"
          >
            {[
              { icon: Truck, label: "Transport", color: "text-emerald-600" },
              { icon: Plane, label: "Flight (ICAO)", color: "text-blue-600" },
              { icon: Ship, label: "Sea (IMO)", color: "text-cyan-600" },
              { icon: Zap, label: "Energy", color: "text-amber-600" },
              { icon: Calculator, label: "Waste (IPCC)", color: "text-rose-600" },
              { icon: Bot, label: "AI Agents", color: "text-violet-600" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                <f.icon className={`h-5 w-5 ${f.color} flex-shrink-0`} />
                <span className="text-[13px] font-semibold text-foreground">{f.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border"
          >
            {[
              { n: "10,000+", l: "Emission Factors", d: "DEFRA, IPCC, CBAM, EPA" },
              { n: "6", l: "Methodologies", d: "Flight, Sea, Vehicle, Energy, Waste, CAT" },
              { n: "50+", l: "Global Regions", d: "Across all continents" },
              { n: "< 50ms", l: "API Response", d: "RESTful endpoints" },
            ].map((s) => (
              <div key={s.l} className="bg-card p-8 text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{s.n}</div>
                <div className="text-[13px] font-semibold text-foreground/85 mt-1">{s.l}</div>
                <div className="text-[11px] text-foreground/60 mt-0.5">{s.d}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TWO-PANE CTA ═══════════════ */}
      <section className="relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left - Professionals */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-secondary px-8 md:px-16 py-20 md:py-28 flex flex-col justify-center"
          >
            <div className="max-w-lg">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center mb-6">
                <BarChart3 className="h-5 w-5 text-background" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                For sustainability
                <br />teams
              </h2>
              <p className="text-foreground/80 mb-8 leading-relaxed">
                Streamline corporate carbon reporting. Automate Scope 1–3 data collection and generate compliance-ready reports in minutes.
              </p>
              <div className="space-y-3 mb-10">
                {["Automated GHG inventory reports", "Scope 1–3 categorization engine", "CSRD & CDP-ready exports"].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                    <span className="text-[14px] text-foreground font-medium">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/farmly")}
                className="group inline-flex items-center gap-2 text-[14px] font-semibold text-foreground hover:text-primary transition-colors"
              >
                Open Product
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* Right - Developers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-foreground px-8 md:px-16 py-20 md:py-28 flex flex-col justify-center"
          >
            <div className="max-w-lg">
              <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center mb-6">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-4 leading-tight tracking-tight">
                For technical
                <br />teams
              </h2>
              <p className="text-background/55 mb-8 leading-relaxed">
                Embed carbon intelligence into your products. Access verified emission factors through our API.
              </p>
              <div className="space-y-3 mb-10">
                {["RESTful API with <50ms response", "10,000+ verified emission factors", "SDKs for Python & Node.js"].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                    <span className="text-[14px] text-background/70 font-medium">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/farmly/docs")}
                className="group inline-flex items-center gap-2 text-[14px] font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                View API Docs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ API DEMO ═══════════════ */}
      <section className="py-28 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-3 block">
                Developer Tools
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
                Powerful API.
                <br />
                <span className="text-foreground/60">Simple integration.</span>
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-10">
                Integrate accurate carbon calculations directly into your supply chain, ERP, or sustainability software.
                Get started in minutes with comprehensive documentation.
              </p>

              <div className="flex items-center gap-8 mb-10">
                {[
                  { icon: Zap, label: "< 50ms", sub: "Latency" },
                  { icon: Code2, label: "REST", sub: "API" },
                  { icon: Database, label: "10K+", sub: "Factors" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center mx-auto mb-2">
                      <item.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="text-[15px] font-bold text-foreground">{item.label}</div>
                    <div className="text-[11px] text-foreground/70">{item.sub}</div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/farmly/docs")}
                className="h-12 px-7 text-[14px] font-semibold rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-lg group"
              >
                Read the Docs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden border border-border shadow-2xl shadow-foreground/5 bg-card">
                <div className="h-9 bg-secondary border-b border-border flex items-center gap-1.5 px-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(45,80%,60%)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                  <span className="ml-3 text-[11px] text-foreground/60 font-mono">farmly-api-demo</span>
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
        </div>
      </section>

      {/* ═══════════════ STANDARDS ═══════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-3 block">
                Standards & Compliance
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
                Science-backed
                <br />
                <span className="text-foreground/60">credibility</span>
              </h2>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Base your corporate climate strategy on credible science, not guesswork.
                Align with the world's most robust carbon accounting standards and reporting frameworks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-3"
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
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src={std.src} alt={std.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[11px] font-bold text-foreground/60 text-center leading-tight">
                    {std.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BOOKING ═══════════════ */}
      <section className="py-28 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-3 block">
              Book a Demo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              Let's connect
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Whether it's for enterprise deployment, API integration, or exploring FarmlyCarbon
              for your organization — pick a time that works.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
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

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-32 px-6 bg-foreground relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-background mb-6 leading-tight tracking-tight">
            Ready to transform your
            <br />
            <span className="text-primary">carbon footprint?</span>
          </h2>
          <p className="text-lg text-background/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join leading enterprises and sustainability teams worldwide who trust FarmlyCarbon
            to drive decarbonization and unlock new revenue streams.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="h-13 px-8 text-[15px] font-semibold rounded-xl bg-background text-foreground hover:bg-background/90 shadow-xl group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/farmly")}
              className="h-13 px-8 text-[15px] font-semibold rounded-xl border-background/20 text-background/80 hover:bg-background/10 hover:text-background transition-all"
            >
              Explore Platform
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-[13px] text-background/40">
            <span>Enterprise Ready</span>
            <span className="w-1 h-1 rounded-full bg-background/20" />
            <span>SOC 2 Compliant</span>
            <span className="w-1 h-1 rounded-full bg-background/20" />
            <span>99.9% Uptime</span>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-card border-t border-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src={farmlyLogo} alt="FarmlyCarbon" className="h-8 w-auto" />
                <span className="text-[16px] font-bold text-foreground">FarmlyCarbon</span>
              </Link>
              <p className="text-[13px] text-foreground/50 leading-relaxed max-w-xs">
                Empowering enterprises with comprehensive carbon management tools for a net-zero future.
              </p>
            </div>

            <div>
              <h4 className="text-[12px] font-bold tracking-[0.1em] uppercase text-foreground/40 mb-4">Platform</h4>
              <div className="space-y-3">
                <Link to="/farmly" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">Product</Link>
                <Link to="/maps" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">Maps</Link>
                <Link to="/farmly/docs" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">API Docs</Link>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-bold tracking-[0.1em] uppercase text-foreground/40 mb-4">Resources</h4>
              <div className="space-y-3">
                <a href="https://idlerwritingeveryday.substack.com" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">Blog</a>
                <Link to="/login" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">Log in</Link>
                <Link to="/signup" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">Sign Up</Link>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-bold tracking-[0.1em] uppercase text-foreground/40 mb-4">Connect</h4>
              <div className="space-y-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">LinkedIn</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-foreground/60 hover:text-foreground transition-colors">Instagram</a>
                <span className="block text-[13px] text-foreground/50">i.kunal.ar26@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-foreground/40">© 2025 FarmlyCarbon. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-[12px] text-foreground/40 hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-[12px] text-foreground/40 hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-[12px] text-foreground/40 hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
