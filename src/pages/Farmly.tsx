import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  Filter,
  PanelLeftClose,
  PanelLeft,
  Leaf,
  Settings,
  Bell,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { ClimateDataExplorer } from "@/components/farmly/ClimateDataExplorer";
import { EmissionCalculator } from "@/components/farmly/EmissionCalculator";
import { CalculationHistoryTable } from "@/components/farmly/CalculationHistoryTable";
import { CarbonAccountingTemplate } from "@/components/farmly/CarbonAccountingTemplate";

const tabItems = [
  { id: "calculator", label: "CALCULATOR", icon: Calculator, color: "#4F46E5" },
  { id: "template", label: "CAT", icon: FileSpreadsheet, color: "#7C3AED" },
  { id: "history", label: "HISTORY", icon: Clock, color: "#2563EB" },
  { id: "explorer", label: "EXPLORER", icon: Compass, color: "#0891B2" },
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
    <div className="h-screen flex flex-col bg-[#F1F5F9]">
      {/* ═══ TOP NAV ═══ */}
      <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-5 shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mr-6">
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#4338CA]">
            <Leaf className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-[#0F172A]">Farmly</span>
          <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-[#4338CA] text-white leading-none">Pro</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 mr-auto">
          {["SEARCH", "BENCHMARK", "IMPORT", "SETTINGS"].map((item) => (
            <Link
              key={item}
              to={item === "SETTINGS" ? "/settings" : item === "IMPORT" ? "/farmly/docs" : "/farmly"}
              className="px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-all duration-100"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="flex items-center gap-0 max-w-[480px] flex-1 mx-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
            <Input
              placeholder="Search emission factors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 h-9 rounded-r-none border-[#D1D5DB] bg-white text-[13px] focus-visible:ring-1 focus-visible:ring-[#4338CA] focus-visible:ring-offset-0 placeholder:text-[#94A3B8]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-[#94A3B8]" />
              </button>
            )}
          </div>
          <button className="h-9 px-4 bg-[#4338CA] hover:bg-[#3730A3] text-white text-[11px] font-bold tracking-wide rounded-r-md transition-colors shrink-0">
            SEARCH
          </button>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1 ml-4">
          <button className="p-1.5 rounded hover:bg-[#F1F5F9] transition-colors">
            <Bell className="h-4 w-4 text-[#94A3B8]" />
          </button>
          <button className="p-1.5 rounded hover:bg-[#F1F5F9] transition-colors">
            <Settings className="h-4 w-4 text-[#94A3B8]" />
          </button>
          <div className="w-7 h-7 rounded-full bg-[#4338CA] text-white text-[11px] font-bold flex items-center justify-center ml-1">
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
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white border-r border-[#E2E8F0] overflow-hidden shrink-0 flex flex-col"
            >
              {/* Sidebar header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#0F172A]">Filters</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-[#94A3B8] hover:text-[#4338CA] rounded transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    RESET
                  </button>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-[#F1F5F9] transition-colors">
                    <PanelLeftClose className="h-3.5 w-3.5 text-[#94A3B8]" />
                  </button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="px-3 py-2">
                  {/* Scope */}
                  <FilterSection title="Emission Scope" isOpen={filterSections.scope} onToggle={() => toggleFilterSection("scope")}>
                    <FilterCheckbox label="Scope 1 — Direct" checked={filters.scope1} onChange={(v) => setFilters((f) => ({ ...f, scope1: !!v }))} />
                    <FilterCheckbox label="Scope 2 — Indirect" checked={filters.scope2} onChange={(v) => setFilters((f) => ({ ...f, scope2: !!v }))} />
                    <FilterCheckbox label="Scope 3 — Value Chain" checked={filters.scope3} onChange={(v) => setFilters((f) => ({ ...f, scope3: !!v }))} />
                  </FilterSection>

                  <div className="border-t border-[#F1F5F9] my-1" />

                  {/* Methodology */}
                  <FilterSection title="Methodology" isOpen={filterSections.methodology} onToggle={() => toggleFilterSection("methodology")}>
                    <FilterCheckbox label="GHG Protocol" checked={filters.ghgProtocol} onChange={(v) => setFilters((f) => ({ ...f, ghgProtocol: !!v }))} />
                    <FilterCheckbox label="IPCC AR6" checked={filters.ipcc} onChange={(v) => setFilters((f) => ({ ...f, ipcc: !!v }))} />
                    <FilterCheckbox label="DEFRA 2024" checked={filters.defra} onChange={(v) => setFilters((f) => ({ ...f, defra: !!v }))} />
                  </FilterSection>

                  <div className="border-t border-[#F1F5F9] my-1" />

                  {/* Region */}
                  <FilterSection title="Region" isOpen={filterSections.region} onToggle={() => toggleFilterSection("region")}>
                    <div className="mb-2">
                      <Input placeholder="Search region..." className="h-7 text-[11px] rounded border-[#E2E8F0] bg-[#F8FAFC] placeholder:text-[#CBD5E1]" />
                    </div>
                    <FilterCheckbox label="Global" checked={true} onChange={() => {}} />
                    <FilterCheckbox label="Europe" checked={false} onChange={() => {}} />
                    <FilterCheckbox label="North America" checked={false} onChange={() => {}} />
                    <FilterCheckbox label="Asia Pacific" checked={false} onChange={() => {}} />
                  </FilterSection>

                  <div className="border-t border-[#F1F5F9] my-1" />

                  {/* Options */}
                  <FilterSection title="Options" isOpen={filterSections.options} onToggle={() => toggleFilterSection("options")}>
                    <div className="flex items-center justify-between py-1">
                      <Label className="text-[11px] font-normal text-[#475569]">Include WTT</Label>
                      <Switch checked={filters.includeWTT} onCheckedChange={(v) => setFilters((f) => ({ ...f, includeWTT: v }))} className="scale-[0.7]" />
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <Label className="text-[11px] font-normal text-[#475569]">Radiative Forcing</Label>
                      <Switch checked={filters.includeRF} onCheckedChange={(v) => setFilters((f) => ({ ...f, includeRF: v }))} className="scale-[0.7]" />
                    </div>
                  </FilterSection>
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ═══ MAIN WORKSPACE ═══ */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Sidebar toggle */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mb-3 p-1.5 rounded bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
            >
              <PanelLeft className="h-4 w-4 text-[#64748B]" />
            </button>
          )}

          {/* Workspace container */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            {/* Tabs row */}
            <div className="px-4 pt-3 pb-0 flex items-center justify-between border-b border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 -mb-px">
                {tabItems.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold tracking-wide rounded-t-md transition-all duration-100 border border-b-0 ${
                        isActive
                          ? "text-white -mb-px relative z-10"
                          : "text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#EEF2FF] hover:text-[#4338CA]"
                      }`}
                      style={isActive ? { background: tab.color, borderColor: tab.color } : {}}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pb-2">
                <Link
                  to="/farmly/docs"
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#64748B] hover:text-[#4338CA] border border-[#E2E8F0] rounded hover:border-[#C7D2FE] hover:bg-[#EEF2FF] transition-all duration-100"
                >
                  <BookOpen className="h-3 w-3" />
                  Docs
                </Link>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
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
  <div className="py-1.5">
    <button onClick={onToggle} className="flex items-center justify-between w-full py-1 group">
      <span className="text-[11px] font-semibold text-[#475569]">{title}</span>
      {isOpen ? (
        <ChevronDown className="h-3 w-3 text-[#94A3B8]" />
      ) : (
        <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
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
          <div className="pt-1.5 space-y-0.5">{children}</div>
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
  <label className="flex items-center gap-2 py-1 cursor-pointer group">
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      className="h-3.5 w-3.5 rounded-sm border-[#CBD5E1] data-[state=checked]:bg-[#4338CA] data-[state=checked]:border-[#4338CA]"
    />
    <span className={`text-[11px] ${checked ? "text-[#1E293B] font-medium" : "text-[#94A3B8]"}`}>
      {label}
    </span>
  </label>
);

export default Farmly;
