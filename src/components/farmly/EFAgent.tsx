import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, Zap, ArrowRight, Loader2 } from "lucide-react";
import { type EmissionFactor } from "@/data/emissionFactors";

interface EFAgentProps {
  factors: EmissionFactor[];
}

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  factors?: EmissionFactor[];
}

export const EFAgent = ({ factors }: EFAgentProps) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      content: "👋 I'm your **Emission Factor Agent**. Ask me about any emission factor — I'll search our database of " + factors.length + " factors and find the best match for your needs.\n\nTry: *\"What's the emission factor for steel production?\"* or *\"Find electricity grid factors for Asia\"*",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const searchFactors = (q: string): EmissionFactor[] => {
    const terms = q.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const scored = factors.map(f => {
      let score = 0;
      const searchable = `${f.name} ${f.category} ${f.sector} ${f.subSector} ${f.description} ${f.source} ${f.region}`.toLowerCase();
      terms.forEach(term => {
        if (searchable.includes(term)) score += 1;
        if (f.name.toLowerCase().includes(term)) score += 2;
      });
      return { factor: f, score };
    });
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.factor);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    setTimeout(() => {
      const results = searchFactors(query);
      let content = "";
      if (results.length === 0) {
        content = "I couldn't find any emission factors matching your query. Try being more specific, or use terms like *steel*, *electricity*, *transport*, *cement*, etc.";
      } else {
        content = `Found **${results.length} matching emission factors** for your query:`;
      }
      
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content,
        factors: results.length > 0 ? results : undefined,
      };
      setMessages(prev => [...prev, agentMsg]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
          <Bot className="h-5 w-5 text-[#0EA5E9]" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-gray-900">EF Agent</h3>
          <p className="text-[11px] text-gray-400">AI-powered emission factor lookup</p>
        </div>
        <Badge className="ml-auto bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20 text-[10px]">
          <Sparkles className="h-3 w-3 mr-1" />
          {factors.length} factors indexed
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
                ? "bg-[#4F46E5] text-white text-[12px]"
                : "bg-gray-50 border border-gray-100 text-[12px] text-gray-700"
            }`}>
              <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }} />
              {msg.factors && (
                <div className="mt-3 space-y-2">
                  {msg.factors.map(f => (
                    <div key={f.id} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-gray-800">{f.name}</span>
                        <Badge variant="outline" className="text-[9px] border-[#4F46E5]/20 text-[#4F46E5]">{f.source}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-500">
                        <span className="font-bold text-[#4F46E5]">{f.fe} kgCO₂eq/{f.unit}</span>
                        <span>•</span>
                        <span>{f.scope.replace("scope", "Scope ")}</span>
                        <span>•</span>
                        <span>{f.region}</span>
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
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0EA5E9]" />
              <span className="text-[11px] text-gray-400">Searching factors...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ask about an emission factor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 h-10 rounded-lg border-gray-200 text-[12px] focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-0 placeholder:text-gray-400"
          />
          <Button
            onClick={handleSubmit}
            disabled={!query.trim() || loading}
            className="h-10 px-4 bg-[#0EA5E9] hover:bg-[#0284C7] text-white rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {["Steel factors", "Electricity grid", "Transport emissions"].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => { setQuery(suggestion); }}
              className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-[#0EA5E9]/10 hover:text-[#0EA5E9] transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
