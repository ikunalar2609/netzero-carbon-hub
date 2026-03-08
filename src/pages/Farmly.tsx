import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Database,
  Sparkles,
  LayoutGrid,
  Bot,
  Table2,
} from "lucide-react";
import { ClimateDataExplorer } from "@/components/farmly/ClimateDataExplorer";
import { EmissionCalculator } from "@/components/farmly/EmissionCalculator";
import { CalculationHistoryTable } from "@/components/farmly/CalculationHistoryTable";
import { CarbonAccountingTemplate } from "@/components/farmly/CarbonAccountingTemplate";

const tabItems = [
  { id: "calculator", label: "BENCHMARK", icon: LayoutGrid, color: "bg-[#4F46E5] text-white" },
  { id: "template", label: "EF AGENT", icon: Bot, color: "bg-[#0EA5E9] text-white" },
  { id: "history", label: "DECARBO AGENT", icon: Sparkles, color: "bg-[#10B981] text-white" },
  { id: "explorer", label: "METHODO AGENT", icon: Compass, color: "bg-[#8B5CF6] text-white" },
];

const Farmly = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "detail">("table");

  const [filterSections, setFilterSections] = useState({
    origin: true,
    unit: true,
    source: true,
  });
  const [filters, setFilters] = useState({
    sharedBase: true,
    privateBase: false,
    favoritesOnly: false,
    kg: true,
    kgC: false,
    unit: false,
    m2: false,
    m3: false,
    sustainalize: true,
    cbam: true,
  });

  const toggleFilterSection = (section: keyof typeof filterSections) => {
    setFilterSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const resetFilters = () => {
    setFilters({
      sharedBase: true, privateBase: false, favoritesOnly: false,
      kg: true, kgC: false, unit: false, m2: false, m3: false,
      sustainalize: true, cbam: true,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#4F46E5]">
      {/* ═══ TOP NAV ═══ */}
      <header className="h-[56px] bg-[#4F46E5] flex items-center px-5 shrink-0 z-20">
        <div className="flex items-center gap-2.5 mr-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-white">Farmly</span>
          <span className="text-[9px] font-bold tracking-widest px-2 py-[3px] rounded-full bg-white/20 text-white/90 leading-none">
            Pro ▾
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {["SEARCH", "BENCHMARK", "IMPORT", "SETTINGS", "COMMUNITY"].map((item) => (
            <Link
              key={item}
              to="/farmly"
              className="px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 ml-auto">
          <button className="p-2 rounded-md hover:bg-white/10 transition-colors">
            <Bell className="h-4 w-4 text-white/60" />
          </button>
          <button className="p-2 rounded-md hover:bg-white/10 transition-colors">
            <Settings className="h-4 w-4 text-white/60" />
          </button>
          <div className="w-7 h-7 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center justify-center ml-1">
            F
          </div>
        </div>
      </header>

      {/* ═══ SEARCH BAR ═══ */}
      <div className="bg-[#4F46E5] px-5 pb-4">
        <div className="flex items-center max-w-full">
          <div className="relative flex-1 mr-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="steel"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11 rounded-lg border-0 bg-white text-[14px] text-gray-900 shadow-lg focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <button className="h-11 px-6 bg-[#3730A3] hover:bg-[#312E81] text-white text-[12px] font-bold tracking-wider rounded-lg transition-colors shrink-0 shadow-lg">
            SEARCH
          </button>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="flex flex-1 overflow-hidden bg-[#EEF2FF] rounded-t-2xl">
        {/* ═══ LEFT SIDEBAR — Light ═══ */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white border-r border-gray-200 overflow-hidden shrink-0 flex flex-col"
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <span className="text-[13px] font-semibold text-gray-800">Filters</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-gray-400 hover:text-[#4F46E5] rounded transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    RESET
                  </button>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100 transition-colors">
                    <PanelLeftClose className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="px-4 py-3 space-y-4">
                  {/* Origin */}
                  <FilterSection title="Origin" isOpen={filterSections.origin} onToggle={() => toggleFilterSection("origin")}>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="origin" checked={filters.sharedBase} onChange={() => setFilters(f => ({...f, sharedBase: true, privateBase: false}))} className="w-3.5 h-3.5 text-[#4F46E5] accent-[#4F46E5]" />
                        <span className="text-[12px] text-gray-700">Shared base</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="origin" checked={filters.privateBase} onChange={() => setFilters(f => ({...f, sharedBase: false, privateBase: true}))} className="w-3.5 h-3.5 text-[#4F46E5] accent-[#4F46E5]" />
                        <span className="text-[12px] text-gray-700">Private base</span>
                      </label>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Label className="text-[12px] text-gray-600">My favorites only <span className="text-gray-400">(0)</span></Label>
                      <Switch checked={filters.favoritesOnly} onCheckedChange={(v) => setFilters(f => ({...f, favoritesOnly: v}))} className="scale-75" />
                    </div>
                    <button className="mt-2 text-[11px] text-[#4F46E5] hover:underline font-medium">
                      Expand All | Collapse All
                    </button>
                  </FilterSection>

                  {/* Unit */}
                  <FilterSection title="Unit" isOpen={filterSections.unit} onToggle={() => toggleFilterSection("unit")}>
                    <div className="mb-2">
                      <Input placeholder="Search unit..." className="h-7 text-[11px] rounded border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400" />
                    </div>
                    <div className="text-[10px] text-[#4F46E5] mb-1.5 font-medium cursor-pointer hover:underline">
                      Select All | Deselect All
                    </div>
                    <div className="space-y-1">
                      <FilterCheckbox label="kg (29946)" checked={filters.kg} onChange={(v) => setFilters(f => ({...f, kg: !!v}))} />
                      <FilterCheckbox label="kC (6705)" checked={filters.kgC} onChange={(v) => setFilters(f => ({...f, kgC: !!v}))} />
                      <FilterCheckbox label="unit (844)" checked={filters.unit} onChange={(v) => setFilters(f => ({...f, unit: !!v}))} />
                      <FilterCheckbox label="m² (815)" checked={filters.m2} onChange={(v) => setFilters(f => ({...f, m2: !!v}))} />
                      <FilterCheckbox label="m³ (564)" checked={filters.m3} onChange={(v) => setFilters(f => ({...f, m3: !!v}))} />
                    </div>
                  </FilterSection>

                  {/* Source */}
                  <FilterSection title="Source" isOpen={filterSections.source} onToggle={() => toggleFilterSection("source")}>
                    <div className="mb-2">
                      <Input placeholder="Search source..." className="h-7 text-[11px] rounded border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400" />
                    </div>
                    <div className="text-[10px] text-[#4F46E5] mb-1.5 font-medium cursor-pointer hover:underline">
                      Select All | Deselect All
                    </div>
                    <div className="space-y-1">
                      <FilterCheckbox label="sustainalize (23693)" checked={filters.sustainalize} onChange={(v) => setFilters(f => ({...f, sustainalize: !!v}))} />
                      <FilterCheckbox label="CBAM (3726)" checked={filters.cbam} onChange={(v) => setFilters(f => ({...f, cbam: !!v}))} />
                    </div>
                  </FilterSection>
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ═══ MAIN WORKSPACE ═══ */}
        <main className="flex-1 overflow-y-auto p-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mb-3 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <PanelLeft className="h-4 w-4 text-gray-500" />
            </button>
          )}

          {/* Workspace card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="px-4 pt-3 pb-0 flex items-center gap-2 border-b border-gray-100">
              <div className="flex items-center gap-2 flex-1">
                {tabItems.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold tracking-wide rounded-t-lg transition-all ${
                        isActive
                          ? `${tab.color} shadow-sm`
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 mb-1 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold transition-all ${
                    viewMode === "table" ? "bg-[#4F46E5] text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Table2 className="h-3 w-3" />
                  TABLE VIEW
                </button>
                <button
                  onClick={() => setViewMode("detail")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold transition-all ${
                    viewMode === "detail" ? "bg-[#4F46E5] text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <LayoutGrid className="h-3 w-3" />
                  DETAILED
                </button>
              </div>
            </div>

            {/* Results count */}
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
              <span className="text-[12px] font-semibold text-gray-600">
                29,932 results found
              </span>
            </div>

            {/* Tab content */}
            <div className="p-4">
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
  <div>
    <button onClick={onToggle} className="flex items-center justify-between w-full py-1 group">
      <span className="text-[12px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{title}</span>
      {isOpen ? (
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
      ) : (
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
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
          <div className="pt-2 space-y-1">{children}</div>
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
      className="h-3.5 w-3.5 rounded border-gray-300 data-[state=checked]:bg-[#4F46E5] data-[state=checked]:border-[#4F46E5]"
    />
    <span className={`text-[11px] transition-colors ${checked ? "text-gray-800 font-medium" : "text-gray-500 group-hover:text-gray-700"}`}>
      {label}
    </span>
  </label>
);

export default Farmly;
