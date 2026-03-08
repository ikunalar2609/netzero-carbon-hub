import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, TrendingDown, Loader2, Leaf, Zap, Factory } from "lucide-react";
import { type EmissionFactor } from "@/data/emissionFactors";

interface DecarboAgentProps {
  factors: EmissionFactor[];
}

interface Recommendation {
  title: string;
  description: string;
  impact: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  icon: React.ReactNode;
}

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  recommendations?: Recommendation[];
}

const recommendations: Record<string, Recommendation[]> = {
  energy: [
    { title: "Switch to renewable electricity tariff", description: "Transition to a 100% renewable energy supplier or purchase RECs/GOs to achieve zero Scope 2 emissions from electricity.", impact: "-30% to -100% Scope 2", difficulty: "Easy", category: "Energy", icon: <Zap className="h-4 w-4 text-amber-500" /> },
    { title: "Install on-site solar PV", description: "Deploy rooftop or ground-mounted solar panels to generate clean electricity and reduce grid dependency.", impact: "-15% to -40% Scope 2", difficulty: "Medium", category: "Energy", icon: <Zap className="h-4 w-4 text-amber-500" /> },
    { title: "Upgrade to high-efficiency boilers", description: "Replace aging gas/oil boilers with condensing or heat pump systems to reduce Scope 1 stationary combustion.", impact: "-10% to -25% Scope 1", difficulty: "Medium", category: "Energy", icon: <Factory className="h-4 w-4 text-gray-500" /> },
  ],
  transport: [
    { title: "Electrify fleet vehicles", description: "Replace diesel/petrol fleet vehicles with EVs, starting with urban delivery routes where range is sufficient.", impact: "-40% to -80% fleet emissions", difficulty: "Hard", category: "Transport", icon: <TrendingDown className="h-4 w-4 text-blue-500" /> },
    { title: "Optimize logistics routing", description: "Use AI-powered route optimization to reduce total distance travelled and fuel consumption.", impact: "-5% to -15% transport", difficulty: "Easy", category: "Transport", icon: <TrendingDown className="h-4 w-4 text-blue-500" /> },
    { title: "Shift freight to rail", description: "Move long-distance freight from road to rail where possible — rail is ~75% less carbon-intensive.", impact: "-20% to -50% freight", difficulty: "Medium", category: "Transport", icon: <TrendingDown className="h-4 w-4 text-blue-500" /> },
  ],
  supply: [
    { title: "Supplier engagement programme", description: "Work with top 20 suppliers by emissions to set science-based targets and report progress.", impact: "-10% to -30% Scope 3", difficulty: "Hard", category: "Supply Chain", icon: <Leaf className="h-4 w-4 text-emerald-500" /> },
    { title: "Switch to low-carbon materials", description: "Substitute high-carbon inputs (e.g., virgin steel, Portland cement) with recycled or bio-based alternatives.", impact: "-15% to -40% Scope 3", difficulty: "Medium", category: "Supply Chain", icon: <Leaf className="h-4 w-4 text-emerald-500" /> },
  ],
  default: [
    { title: "Conduct a full carbon footprint assessment", description: "Map Scope 1, 2 and 3 emissions using GHG Protocol methodology to identify your biggest reduction opportunities.", impact: "Baseline identification", difficulty: "Easy", category: "Strategy", icon: <Sparkles className="h-4 w-4 text-purple-500" /> },
    { title: "Set Science-Based Targets (SBTi)", description: "Commit to near-term targets aligned with 1.5°C pathway through the Science Based Targets initiative.", impact: "Strategic alignment", difficulty: "Medium", category: "Strategy", icon: <Sparkles className="h-4 w-4 text-purple-500" /> },
  ],
};

export const DecarboAgent = ({ factors }: DecarboAgentProps) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      content: "🌱 I'm your **Decarbonization Agent**. Tell me about your industry or emissions challenge, and I'll recommend actionable reduction strategies.\n\nTry: *\"How can I reduce energy emissions?\"* or *\"Decarbonize my supply chain\"*",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = (q: string): Recommendation[] => {
    const lower = q.toLowerCase();
    if (lower.includes("energy") || lower.includes("electricity") || lower.includes("power") || lower.includes("grid")) {
      return recommendations.energy;
    }
    if (lower.includes("transport") || lower.includes("fleet") || lower.includes("vehicle") || lower.includes("logistics") || lower.includes("freight")) {
      return recommendations.transport;
    }
    if (lower.includes("supply") || lower.includes("scope 3") || lower.includes("supplier") || lower.includes("material") || lower.includes("procurement")) {
      return recommendations.supply;
    }
    return recommendations.default;
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    setTimeout(() => {
      const recs = getRecommendations(query);
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: `Here are **${recs.length} decarbonization strategies** based on your query:`,
        recommendations: recs,
      };
      setMessages(prev => [...prev, agentMsg]);
      setLoading(false);
    }, 1000);
  };

  const difficultyColor: Record<string, string> = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Hard: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Leaf className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-gray-900">Decarbo Agent</h3>
          <p className="text-[11px] text-gray-400">AI-powered decarbonization advisor</p>
        </div>
        <Badge className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
          <TrendingDown className="h-3 w-3 mr-1" />
          Active
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-emerald-600 text-white text-[12px]"
                : "bg-gray-50 border border-gray-100 text-[12px] text-gray-700"
            }`}>
              <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }} />
              {msg.recommendations && (
                <div className="mt-3 space-y-2">
                  {msg.recommendations.map((rec, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        {rec.icon}
                        <span className="text-[12px] font-semibold text-gray-800">{rec.title}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-2 leading-relaxed">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] bg-[#4F46E5]/5 text-[#4F46E5] border-[#4F46E5]/20">
                          {rec.impact}
                        </Badge>
                        <Badge variant="outline" className={`text-[9px] border ${difficultyColor[rec.difficulty]}`}>
                          {rec.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
              <span className="text-[11px] text-gray-400">Analyzing strategies...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Describe your decarbonization challenge..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 h-10 rounded-lg border-gray-200 text-[12px] focus-visible:ring-emerald-500 focus-visible:ring-offset-0 placeholder:text-gray-400"
          />
          <Button
            onClick={handleSubmit}
            disabled={!query.trim() || loading}
            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {["Reduce energy emissions", "Decarbonize supply chain", "Fleet electrification"].map(s => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
