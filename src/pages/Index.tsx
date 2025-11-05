import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BarChart3, Target, Zap, Play, CheckCircle2 } from "lucide-react";
import ipccLogo from "@/assets/logos/ipcc-logo.png";
import sbtiLogo from "@/assets/logos/sbti-logo.png";
import oxfordLogo from "@/assets/logos/oxford-logo.png";
import carbonIntegrityLogo from "@/assets/logos/carbon-integrity-logo.png";
import wwfLogo from "@/assets/logos/wwf-logo.png";
import goldStandardLogo from "@/assets/logos/gold-standard-logo.png";

const Index = () => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Headline & CTA */}
          <div className="max-w-[680px]">
            <h1 className="text-[48px] lg:text-[56px] font-bold leading-[1.1] text-[hsl(var(--color-text-dark))] mb-6">
              Build your{" "}
              <span className="bg-[hsl(var(--neon-lime))] px-3 py-1 rounded-md">
                carbon strategy
              </span>{" "}
              with AI-powered precision
            </h1>
            <p className="text-[22px] text-[hsl(var(--color-text-dark))] opacity-70 mb-8 leading-[1.5] max-w-[600px]">
              Transform climate commitments into actionable plans. Science-backed, 
              automated, and aligned with global standards.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="flex gap-3 mb-4">
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 rounded-full border-gray-300 shadow-sm text-base px-6"
              />
              <Button
                type="submit"
                className="h-14 px-8 rounded-full bg-[hsl(var(--neon-lime))] text-black font-semibold hover:bg-[hsl(var(--neon-lime))]/90 hover:scale-105 transition-all shadow-md"
              >
                Create strategy <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
            <p className="text-sm text-gray-500">No credit card required · Free trial available</p>
          </div>

          {/* Right: Stats/Charts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-[var(--shadow-card)]">
              <BarChart3 className="h-8 w-8 text-[hsl(var(--neon-lime))] mb-3" />
              <div className="text-3xl font-bold text-[hsl(var(--color-text-dark))] mb-1">-42%</div>
              <div className="text-sm text-gray-600">Average emission reduction</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-[var(--shadow-card)]">
              <Target className="h-8 w-8 text-[hsl(var(--neon-lime))] mb-3" />
              <div className="text-3xl font-bold text-[hsl(var(--color-text-dark))] mb-1">2030</div>
              <div className="text-sm text-gray-600">Net-zero target year</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-[var(--shadow-card)] col-span-2">
              <Zap className="h-8 w-8 text-[hsl(var(--neon-lime))] mb-3" />
              <div className="text-3xl font-bold text-[hsl(var(--color-text-dark))] mb-1">5 minutes</div>
              <div className="text-sm text-gray-600">To generate your first strategy</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 lg:px-12 bg-[hsl(var(--color-bg-pale-mint))]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[40px] font-bold text-[hsl(var(--color-text-dark))] text-center mb-4">
            How it works
          </h2>
          <p className="text-[18px] text-gray-600 text-center mb-16 max-w-[600px] mx-auto">
            Three simple steps to build a credible, science-backed climate strategy
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: BarChart3,
                title: "Input your data",
                description: "Upload emissions data or connect your existing systems. Our AI validates and structures everything automatically."
              },
              {
                step: "02",
                icon: Target,
                title: "Set your goals",
                description: "Define targets aligned with SBTi, Net Zero standards, or custom objectives. Get instant feasibility analysis."
              },
              {
                step: "03",
                icon: CheckCircle2,
                title: "Execute & track",
                description: "Generate detailed roadmaps, track progress in real-time, and adjust as you go with AI-powered insights."
              }
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-2xl shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-[48px] font-bold text-[hsl(var(--neon-lime))]">
                    {item.step}
                  </div>
                  <item.icon className="h-10 w-10 text-[hsl(var(--color-text-dark))]" />
                </div>
                <h3 className="text-[24px] font-semibold text-[hsl(var(--color-text-dark))] mb-3">
                  {item.title}
                </h3>
                <p className="text-[16px] text-gray-600 leading-[1.6]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science-Backed Credibility Section */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[40px] font-bold text-[hsl(var(--color-text-dark))] mb-6 max-w-[800px] mx-auto leading-[1.2]">
              Base your climate strategy on{" "}
              <span className="bg-[hsl(var(--neon-lime))] px-3 py-1 rounded-md">
                credible science
              </span>
              , not guesswork
            </h2>
            <p className="text-[18px] text-gray-600 max-w-[700px] mx-auto">
              Align your carbon offsetting with robust standards that fit your company's 
              unique goals, budget, and marketing needs
            </p>
          </div>

          <div className="bg-[hsl(var(--light-gray))] rounded-3xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              <img src={ipccLogo} alt="IPCC" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src={sbtiLogo} alt="SBTi Net Zero" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src={oxfordLogo} alt="Oxford Principles" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src={carbonIntegrityLogo} alt="Carbon Integrity" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src={wwfLogo} alt="WWF" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src={goldStandardLogo} alt="Gold Standard" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Green CTA Block */}
      <section className="py-24 px-6 lg:px-12 bg-[hsl(var(--color-bg-olive))]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[44px] font-bold text-white mb-6 leading-[1.2]">
            Ready to transform your climate commitment into action?
          </h2>
          <p className="text-[20px] text-white/80 mb-10 max-w-[600px] mx-auto">
            Join leading companies using AI to accelerate their journey to net-zero
          </p>
          <Button className="h-16 px-12 rounded-full bg-[hsl(var(--neon-lime))] text-black font-bold text-lg hover:bg-[hsl(var(--neon-lime))]/90 hover:scale-105 transition-all shadow-lg">
            Get started now <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[40px] font-bold text-[hsl(var(--color-text-dark))] text-center mb-4">
            See it in action
          </h2>
          <p className="text-[18px] text-gray-600 text-center mb-12">
            Watch how companies are building their carbon strategies in minutes
          </p>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button className="h-20 w-20 rounded-full bg-[hsl(var(--neon-lime))] hover:bg-[hsl(var(--neon-lime))]/90 hover:scale-110 transition-all shadow-xl">
                <Play className="h-10 w-10 text-black fill-black" />
              </Button>
            </div>
            {/* Placeholder for actual video */}
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          </div>
        </div>
      </section>

      {/* Calendar Booking Section */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[40px] font-bold text-[hsl(var(--color-text-dark))] mb-4">
              Let's Connect
            </h2>
            <p className="text-[18px] text-gray-600 max-w-[700px] mx-auto leading-[1.6]">
              Got something exciting in mind? Whether it's about ideas, collaborations, 
              or just a good conversation — I'd love to connect. Pick a time that works 
              best for you below.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl">
            <iframe 
              src="https://cal.com/kunal-rahangdale-8dbab0/30min?overlayCalendar=true" 
              width="100%" 
              height="700" 
              style={{ border: "none" }}
              allow="fullscreen"
            />
          </div>
        </div>
      </section>

      {/* Final Footer CTA */}
      <section className="py-20 px-6 lg:px-12 bg-[hsl(var(--color-bg-pale-mint))]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[36px] font-bold text-[hsl(var(--color-text-dark))] mb-6">
            Start building your climate strategy today
          </h2>
          <p className="text-[18px] text-gray-600 mb-8">
            No guesswork. No complexity. Just science-backed action.
          </p>
          <Button className="h-14 px-10 rounded-full bg-[hsl(var(--neon-lime))] text-black font-semibold hover:bg-[hsl(var(--neon-lime))]/90 hover:scale-105 transition-all shadow-md">
            Create your plan <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
