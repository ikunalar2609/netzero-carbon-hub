import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Leaf,
  Settings,
  Bell,
  RotateCcw,
  LayoutGrid,
  Bot,
  Compass,
  Table2,
  Sparkles,
  Calculator,
  History,
} from "lucide-react";
import { BenchmarkTable } from "@/components/farmly/BenchmarkTable";
import { EFAgent } from "@/components/farmly/EFAgent";
import { DecarboAgent } from "@/components/farmly/DecarboAgent";
import { ClimateDataExplorer } from "@/components/farmly/ClimateDataExplorer";
import { CalculationHistoryTable } from "@/components/farmly/CalculationHistoryTable";
import { EmissionCalculator } from "@/components/farmly/EmissionCalculator";
import {
  emissionFactors as rawFactors,
  applyFilters,
  getFilterOptions,
  type FarmlyFilters,
  type EmissionFactor,
} from "@/data/emissionFactors";

const tabItems = [
  { id: "calculator", label: "CALCULATOR", icon: Calculator, color: "bg-[#F59E0B] text-white" },
  { id: "benchmark", label: "BENCHMARK", icon: LayoutGrid, color: "bg-[#4F46E5] text-white" },
  { id: "ef-agent", label: "EF AGENT", icon: Bot, color: "bg-[#0EA5E9] text-white" },
  { id: "decarbo", label: "DECARBO AGENT", icon: Sparkles, color: "bg-[#10B981] text-white" },
  { id: "methodo", label: "METHODO AGENT", icon: Compass, color: "bg-[#8B5CF6] text-white" },
  { id: "history", label: "HISTORY", icon: History, color: "bg-[#64748B] text-white" },
];

const Farmly = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "detail">("table");

  // Filters
  const [filters, setFilters] = useState<FarmlyFilters>({
    origin: "shared",
    favoritesOnly: false,
    units: [],
    sources: [],
    searchQuery: "",
    scope: [],
    methodology: [],
    region: [],
  });

  // Favorites stored locally
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Add favorites to factors
  const factorsWithFavorites: EmissionFactor[] = useMemo(
    () => rawFactors.map(f => ({ ...f, isFavorite: favorites.has(f.id) })),
    [favorites]
  );

  // Apply all filters
  const filteredFactors = useMemo(
    () => applyFilters(factorsWithFavorites, filters),
    [factorsWithFavorites, filters]
  );

  const filterOptions = useMemo(() => getFilterOptions(), []);

  // Sidebar filter sections
  const [filterSections, setFilterSections] = useState({
    origin: true,
    unit: true,
    source: true,
    scope: false,
    methodology: false,
    region: false,
  });

  const toggleFilterSection = (section: keyof typeof filterSections) => {
    setFilterSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const resetFilters = () => {
    setFilters({
      origin: "shared",
      favoritesOnly: false,
      units: [],
      sources: [],
      searchQuery: "",
      scope: [],
      methodology: [],
      region: [],
    });
  };

  const toggleArrayFilter = (
    key: "units" | "sources" | "scope" | "methodology" | "region",
    value: string
  ) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  const activeFilterCount = [
    filters.units.length,
    filters.sources.length,
    filters.scope.length,
    filters.methodology.length,
    filters.region.length,
    filters.favoritesOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

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
              placeholder="Search emission factors..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
              className="pl-10 pr-10 h-11 rounded-lg border-0 bg-white text-[14px] text-gray-900 shadow-lg focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 placeholder:text-gray-400"
            />
            {filters.searchQuery && (
              <button onClick={() => setFilters(f => ({ ...f, searchQuery: "" }))} className="absolute right-3 top-1/2 -translate-y-1/2">
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
        {/* ═══ LEFT SIDEBAR ═══ */}
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
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-gray-800">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="text-[9px] font-bold bg-[#4F46E5] text-white px-1.5 py-0.5 rounded-full leading-none">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
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
                        <input type="radio" name="origin" checked={filters.origin === "shared"} onChange={() => setFilters(f => ({...f, origin: "shared"}))} className="w-3.5 h-3.5 accent-[#4F46E5]" />
                        <span className="text-[12px] text-gray-700">Shared base</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="origin" checked={filters.origin === "private"} onChange={() => setFilters(f => ({...f, origin: "private"}))} className="w-3.5 h-3.5 accent-[#4F46E5]" />
                        <span className="text-[12px] text-gray-700">Private base</span>
                      </label>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Label className="text-[12px] text-gray-600">
                        My favorites only <span className="text-gray-400">({favorites.size})</span>
                      </Label>
                      <Switch
                        checked={filters.favoritesOnly}
                        onCheckedChange={(v) => setFilters(f => ({...f, favoritesOnly: v}))}
                        className="scale-75"
                      />
                    </div>
                  </FilterSection>

                  {/* Unit */}
                  <FilterSection title={`Unit (${filterOptions.units.length})`} isOpen={filterSections.unit} onToggle={() => toggleFilterSection("unit")}>
                    <div className="text-[10px] text-[#4F46E5] mb-1.5 font-medium cursor-pointer hover:underline"
                      onClick={() => setFilters(f => ({ ...f, units: f.units.length === filterOptions.units.length ? [] : [...filterOptions.units] }))}>
                      {filters.units.length === filterOptions.units.length ? "Deselect All" : "Select All"}
                    </div>
                    <div className="space-y-1">
                      {filterOptions.units.map(u => (
                        <FilterCheckbox
                          key={u}
                          label={`${u} (${filterOptions.unitCounts[u]})`}
                          checked={filters.units.includes(u)}
                          onChange={() => toggleArrayFilter("units", u)}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  {/* Source */}
                  <FilterSection title={`Source (${filterOptions.sources.length})`} isOpen={filterSections.source} onToggle={() => toggleFilterSection("source")}>
                    <div className="text-[10px] text-[#4F46E5] mb-1.5 font-medium cursor-pointer hover:underline"
                      onClick={() => setFilters(f => ({ ...f, sources: f.sources.length === filterOptions.sources.length ? [] : [...filterOptions.sources] }))}>
                      {filters.sources.length === filterOptions.sources.length ? "Deselect All" : "Select All"}
                    </div>
                    <div className="space-y-1">
                      {filterOptions.sources.map(s => (
                        <FilterCheckbox
                          key={s}
                          label={`${s} (${filterOptions.sourceCounts[s]})`}
                          checked={filters.sources.includes(s)}
                          onChange={() => toggleArrayFilter("sources", s)}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  {/* Scope */}
                  <FilterSection title="Scope" isOpen={filterSections.scope} onToggle={() => toggleFilterSection("scope")}>
                    <div className="space-y-1">
                      {filterOptions.scopes.map(s => (
                        <FilterCheckbox
                          key={s}
                          label={s.replace("scope", "Scope ")}
                          checked={filters.scope.includes(s)}
                          onChange={() => toggleArrayFilter("scope", s)}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  {/* Methodology */}
                  <FilterSection title="Methodology" isOpen={filterSections.methodology} onToggle={() => toggleFilterSection("methodology")}>
                    <div className="space-y-1">
                      {filterOptions.methodologies.map(m => (
                        <FilterCheckbox
                          key={m}
                          label={m}
                          checked={filters.methodology.includes(m)}
                          onChange={() => toggleArrayFilter("methodology", m)}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  {/* Region */}
                  <FilterSection title="Region" isOpen={filterSections.region} onToggle={() => toggleFilterSection("region")}>
                    <div className="space-y-1">
                      {filterOptions.regions.map(r => (
                        <FilterCheckbox
                          key={r}
                          label={r}
                          checked={filters.region.includes(r)}
                          onChange={() => toggleArrayFilter("region", r)}
                        />
                      ))}
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
                        isActive ? `${tab.color} shadow-sm` : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {activeTab === "benchmark" && (
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
              )}
            </div>

            {/* Results count */}
            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
              <span className="text-[12px] font-semibold text-gray-600">
                {filteredFactors.length.toLocaleString()} results found
                {activeFilterCount > 0 && (
                  <span className="text-gray-400 font-normal ml-1">
                    ({activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active)
                  </span>
                )}
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
                  {activeTab === "benchmark" && (
                    <BenchmarkTable factors={filteredFactors} onToggleFavorite={toggleFavorite} />
                  )}
                  {activeTab === "ef-agent" && <EFAgent factors={filteredFactors} />}
                  {activeTab === "decarbo" && <DecarboAgent factors={filteredFactors} />}
                  {activeTab === "methodo" && <ClimateDataExplorer />}
                  {activeTab === "history" && <CalculationHistoryTable />}
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
  onChange: () => void;
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
