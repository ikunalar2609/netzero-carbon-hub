import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calculator,
  FileSpreadsheet,
  Clock,
  Compass,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Leaf,
  Settings,
  Bell,
  BookOpen,
  RotateCcw,
  Layers,
  Database,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { ClimateDataExplorer } from "@/components/farmly/ClimateDataExplorer";
import { EmissionCalculator } from "@/components/farmly/EmissionCalculator";
import { CalculationHistoryTable } from "@/components/farmly/CalculationHistoryTable";
import { CarbonAccountingTemplate } from "@/components/farmly/CarbonAccountingTemplate";

const tabItems = [
  { id: "calculator", label: "CALCULATOR", icon: Calculator },
  { id: "template", label: "CAT", icon: FileSpreadsheet },
  { id: "history", label: "HISTORY", icon: Clock },
  { id: "explorer", label: "EXPLORER", icon: Compass },
];

const Farmly = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filterSections, setFilterSections] = useState({
    scope: true,
    methodology: true,
    region: false,
    options: false,
  });
  const [filters, setFilters] = useState({
    scope1: true,
    scope2: true,
    scope3: false,
    ghgProtocol: true,
    ipcc: true,
    defra: false,
    includeWTT: false,
    includeRF: false,
  });

  const toggleFilterSection = (section: keyof typeof filterSections) => {
    setFilterSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const resetFilters = () => {
    setFilters({
      scope1: true, scope2: true, scope3: false,
      ghgProtocol: true, ipcc: true, defra: false,
      includeWTT: false, includeRF: false,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#0B0F1A] farmly-dark text-white">
      {/* ═══ TOP NAV — Dark premium bar ═══ */}
      <header className="h-[52px] bg-[#0F1629] border-b border-[#1E293B] flex items-center px-4 shrink-0 z-20">
        {/* Logo cluster */}
        <div className="flex items-center gap-2 mr-5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#4F46E5]">
            <Leaf className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[14px] font-bold tracking-tight text-white">Farmly</span>
          <span className="text-[9px] font-bold tracking-widest px-1.5 py-[2px] rounded bg-[#6366F1]/20 text-[#A5B4FC] leading-none border border-[#6366F1]/30">PRO</span>
        </div>

        {/* Search — compact */}
        <div className="flex items-center max-w-[420px] flex-1 mx-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#475569]" />
            <Input
              placeholder="Search emission factors, methodologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 h-8 rounded-md border-[#1E293B] bg-[#0B0F1A] text-[12px] text-[#CBD5E1] focus-visible:ring-1 focus-visible:ring-[#6366F1] focus-visible:ring-offset-0 focus-visible:border-[#6366F1] placeholder:text-[#475569]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="h-3 w-3 text-[#475569]" />
              </button>
            )}
          </div>
          <button className="h-8 px-3 ml-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[10px] font-bold tracking-wider rounded-md transition-colors shrink-0">
            SEARCH
          </button>
        </div>

        {/* Right nav links */}
        <nav className="hidden md:flex items-center gap-0.5 ml-auto">
          {[
            { label: "BENCHMARK", href: "/farmly" },
            { label: "IMPORT", href: "/farmly/docs" },
            { label: "DOCS", href: "/farmly/docs" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#64748B] hover:text-[#E2E8F0] hover:bg-[#1E293B] rounded transition-all duration-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-0.5 ml-3">
          <button className="p-1.5 rounded hover:bg-[#1E293B] transition-colors">
            <Bell className="h-3.5 w-3.5 text-[#475569]" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#1E293B] transition-colors">
            <Settings className="h-3.5 w-3.5 text-[#475569]" />
          </button>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center ml-1">
            F
          </div>
        </div>
      </header>

      {/* ═══ BODY ═══ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ═══ LEFT SIDEBAR ═══ */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[#0F1629] border-r border-[#1E293B] overflow-hidden shrink-0 flex flex-col"
            >
              {/* Sidebar header */}
              <div className="px-3 py-2.5 flex items-center justify-between border-b border-[#1E293B]">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#6366F1]" />
                  <span className="text-[11px] font-bold text-[#E2E8F0] tracking-wide">FILTERS</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold text-[#475569] hover:text-[#A5B4FC] rounded transition-colors tracking-wider"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    RESET
                  </button>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-[#1E293B] transition-colors">
                    <PanelLeftClose className="h-3 w-3 text-[#475569]" />
                  </button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="px-2.5 py-2">
                  {/* Scope */}
                  <FilterSection title="EMISSION SCOPE" isOpen={filterSections.scope} onToggle={() => toggleFilterSection("scope")}>
                    <FilterCheckbox label="Scope 1 — Direct" checked={filters.scope1} onChange={(v) => setFilters((f) => ({ ...f, scope1: !!v }))} />
                    <FilterCheckbox label="Scope 2 — Indirect" checked={filters.scope2} onChange={(v) => setFilters((f) => ({ ...f, scope2: !!v }))} />
                    <FilterCheckbox label="Scope 3 — Value Chain" checked={filters.scope3} onChange={(v) => setFilters((f) => ({ ...f, scope3: !!v }))} />
                  </FilterSection>

                  <div className="border-t border-[#1E293B] my-1.5" />

                  {/* Methodology */}
                  <FilterSection title="METHODOLOGY" isOpen={filterSections.methodology} onToggle={() => toggleFilterSection("methodology")}>
                    <FilterCheckbox label="GHG Protocol" checked={filters.ghgProtocol} onChange={(v) => setFilters((f) => ({ ...f, ghgProtocol: !!v }))} />
                    <FilterCheckbox label="IPCC AR6" checked={filters.ipcc} onChange={(v) => setFilters((f) => ({ ...f, ipcc: !!v }))} />
                    <FilterCheckbox label="DEFRA 2024" checked={filters.defra} onChange={(v) => setFilters((f) => ({ ...f, defra: !!v }))} />
                  </FilterSection>

                  <div className="border-t border-[#1E293B] my-1.5" />

                  {/* Region */}
                  <FilterSection title="REGION" isOpen={filterSections.region} onToggle={() => toggleFilterSection("region")}>
                    <div className="mb-1.5">
                      <Input placeholder="Search region..." className="h-6 text-[10px] rounded border-[#1E293B] bg-[#0B0F1A] text-[#CBD5E1] placeholder:text-[#334155]" />
                    </div>
                    <FilterCheckbox label="Global" checked={true} onChange={() => {}} />
                    <FilterCheckbox label="Europe" checked={false} onChange={() => {}} />
                    <FilterCheckbox label="North America" checked={false} onChange={() => {}} />
                    <FilterCheckbox label="Asia Pacific" checked={false} onChange={() => {}} />
                  </FilterSection>

                  <div className="border-t border-[#1E293B] my-1.5" />

                  {/* Options */}
                  <FilterSection title="OPTIONS" isOpen={filterSections.options} onToggle={() => toggleFilterSection("options")}>
                    <div className="flex items-center justify-between py-1">
                      <Label className="text-[10px] font-normal text-[#94A3B8]">Include WTT</Label>
                      <Switch checked={filters.includeWTT} onCheckedChange={(v) => setFilters((f) => ({ ...f, includeWTT: v }))} className="scale-[0.65]" />
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <Label className="text-[10px] font-normal text-[#94A3B8]">Radiative Forcing</Label>
                      <Switch checked={filters.includeRF} onCheckedChange={(v) => setFilters((f) => ({ ...f, includeRF: v }))} className="scale-[0.65]" />
                    </div>
                  </FilterSection>
                </div>
              </ScrollArea>

              {/* Bottom info */}
              <div className="px-3 py-2 border-t border-[#1E293B]">
                <div className="flex items-center gap-1.5 text-[9px] text-[#475569]">
                  <Database className="h-3 w-3" />
                  <span>29,932 emission factors</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ═══ MAIN WORKSPACE ═══ */}
        <main className="flex-1 overflow-y-auto bg-[#0B0F1A] p-3">
          {/* Sidebar toggle */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mb-2 p-1.5 rounded bg-[#0F1629] border border-[#1E293B] hover:bg-[#1E293B] transition-colors"
            >
              <PanelLeft className="h-3.5 w-3.5 text-[#64748B]" />
            </button>
          )}

          {/* Workspace container */}
          <div className="bg-[#0F1629] rounded-lg border border-[#1E293B] shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            {/* Title bar + tabs */}
            <div className="px-4 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#6366F1]" />
                  <span className="text-[13px] font-bold text-white">Intelligence Layer</span>
                </div>
                <span className="text-[10px] text-[#475569]">for Carbon Analytics</span>
              </div>
              <Link
                to="/farmly/docs"
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[#64748B] hover:text-[#A5B4FC] border border-[#1E293B] rounded hover:border-[#6366F1]/40 hover:bg-[#6366F1]/5 transition-all duration-100"
              >
                <BookOpen className="h-3 w-3" />
                Docs
              </Link>
            </div>

            {/* Action tabs row */}
            <div className="px-4 pt-3 pb-0 flex items-center gap-1.5 border-b border-[#1E293B]">
              {tabItems.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-bold tracking-wider rounded-t-md transition-all duration-100 border-b-2 ${
                      isActive
                        ? "text-white bg-[#1E293B]/60 border-b-[#6366F1]"
                        : "text-[#475569] border-b-transparent hover:text-[#94A3B8] hover:bg-[#1E293B]/30"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}

              {/* Result count pill */}
              <div className="ml-auto mb-1.5 flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1E293B] border border-[#334155]">
                  <BarChart3 className="h-3 w-3 text-[#6366F1]" />
                  <span className="text-[9px] font-semibold text-[#94A3B8]">29,932 results</span>
                </div>
              </div>
            </div>

            {/* Tab content — light bg for inner components */}
            <div className="p-4 bg-white rounded-b-lg text-[#1E293B] [&_*]:text-inherit">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.12 }}
                >
                  {activeTab === "calculator" && <EmissionCalculator />}
                  {activeTab === "template" && <CarbonAccountingTemplate />}
                  {activeTab === "history" && <CalculationHistoryTable />}
                  {activeTab === "explorer" && <ClimateDataExplorer />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* ─── Filter Sub-components ─── */

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="py-1">
    <button onClick={onToggle} className="flex items-center justify-between w-full py-1 group">
      <span className="text-[9px] font-bold tracking-widest text-[#64748B] group-hover:text-[#94A3B8] transition-colors">{title}</span>
      {isOpen ? (
        <ChevronDown className="h-3 w-3 text-[#475569]" />
      ) : (
        <ChevronRight className="h-3 w-3 text-[#475569]" />
      )}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="overflow-hidden"
        >
          <div className="pt-1 space-y-0.5">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FilterCheckbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean | "indeterminate") => void;
}) => (
  <label className="flex items-center gap-2 py-0.5 cursor-pointer group">
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      className="h-3 w-3 rounded-[3px] border-[#334155] data-[state=checked]:bg-[#6366F1] data-[state=checked]:border-[#6366F1]"
    />
    <span className={`text-[10px] transition-colors ${checked ? "text-[#E2E8F0] font-medium" : "text-[#64748B] group-hover:text-[#94A3B8]"}`}>
      {label}
    </span>
  </label>
);

export default Farmly;
