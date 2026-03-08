import { useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Upload,
  Download,
  FileText,
  Globe,
  Palette,
  Shield,
  Database,
  ExternalLink,
} from "lucide-react";
import { BenchmarkTable } from "@/components/farmly/BenchmarkTable";
import { EFAgent } from "@/components/farmly/EFAgent";
import { DecarboAgent } from "@/components/farmly/DecarboAgent";
import { ClimateDataExplorer } from "@/components/farmly/ClimateDataExplorer";
import { CalculationHistoryTable } from "@/components/farmly/CalculationHistoryTable";
import { EmissionCalculator } from "@/components/farmly/EmissionCalculator";
import { FarmlyReport } from "@/components/farmly/FarmlyReport";
import { NotificationPanel } from "@/components/farmly/NotificationPanel";
import {
  emissionFactors as rawFactors,
  applyFilters,
  getFilterOptions,
  defaultFilters,
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
  { id: "report", label: "REPORT", icon: FileText, color: "bg-[#DC2626] text-white" },
];

const Farmly = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calculator");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "detail">("table");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dialogs
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Settings state
  const [settingsState, setSettingsState] = useState({
    defaultUnit: "kgCO2e",
    defaultRegion: "Global",
    autoSaveCalc: true,
    showUncertainty: false,
    compactView: false,
    notifyUpdates: true,
    gwpVersion: "AR6",
    exportFormat: "csv",
  });

  // Filters
  const [filters, setFilters] = useState<FarmlyFilters>({ ...defaultFilters });

  // Favorites stored locally
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const factorsWithFavorites: EmissionFactor[] = useMemo(
    () => rawFactors.map(f => ({ ...f, isFavorite: favorites.has(f.id) })),
    [favorites]
  );

  const filteredFactors = useMemo(
    () => applyFilters(factorsWithFavorites, filters),
    [factorsWithFavorites, filters]
  );

  const filterOptions = useMemo(() => getFilterOptions(), []);

  const [filterSections, setFilterSections] = useState({
    origin: true,
    unit: true,
    source: true,
    scope: false,
    methodology: false,
    region: false,
    category: false,
    sector: false,
    dataType: false,
    perimeter: false,
  });

  const toggleFilterSection = (section: keyof typeof filterSections) => {
    setFilterSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
  };

  const toggleArrayFilter = (
    key: "units" | "sources" | "scope" | "methodology" | "region" | "category" | "sector" | "dataType" | "perimeter",
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
    filters.category.length,
    filters.sector.length,
    filters.dataType.length,
    filters.perimeter.length,
    filters.favoritesOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Header nav actions
  const handleHeaderNav = (item: string) => {
    switch (item) {
      case "SEARCH":
        searchInputRef.current?.focus();
        searchInputRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "BENCHMARK":
        setActiveTab("benchmark");
        break;
      case "IMPORT":
        setImportOpen(true);
        break;
      case "SETTINGS":
        setSettingsOpen(true);
        break;
      case "COMMUNITY":
        window.open("https://farmly-carbon.lovable.app", "_blank");
        break;
      case "DOCS":
        navigate("/farmly/docs");
        break;
    }
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
          {["SEARCH", "BENCHMARK", "IMPORT", "SETTINGS", "COMMUNITY", "DOCS"].map((item) => (
            <button
              key={item}
              onClick={() => handleHeaderNav(item)}
              className={`px-3 py-1.5 text-[11px] font-semibold tracking-wide rounded-md transition-all ${
                (item === "BENCHMARK" && activeTab === "benchmark")
                  ? "text-white bg-white/20"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 ml-auto relative">
          <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-md hover:bg-white/10 transition-colors relative">
            <Bell className="h-4 w-4 text-white/60" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 border border-[#4F46E5]" />
          </button>
          <NotificationPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
          <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-md hover:bg-white/10 transition-colors">
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
              ref={searchInputRef}
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
          <button
            onClick={() => searchInputRef.current?.focus()}
            className="h-11 px-6 bg-[#3730A3] hover:bg-[#312E81] text-white text-[12px] font-bold tracking-wider rounded-lg transition-colors shrink-0 shadow-lg"
          >
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

                  {/* Category */}
                  <FilterSection title={`Category (${filterOptions.categories.length})`} isOpen={filterSections.category} onToggle={() => toggleFilterSection("category")}>
                    <div className="space-y-1">
                      {filterOptions.categories.map(c => (
                        <FilterCheckbox
                          key={c}
                          label={`${c} (${filterOptions.categoryCounts[c]})`}
                          checked={filters.category.includes(c)}
                          onChange={() => toggleArrayFilter("category", c)}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  {/* Sector */}
                  <FilterSection title={`Sector (${filterOptions.sectors.length})`} isOpen={filterSections.sector} onToggle={() => toggleFilterSection("sector")}>
                    <div className="space-y-1">
                      {filterOptions.sectors.map(s => (
                        <FilterCheckbox
                          key={s}
                          label={`${s} (${filterOptions.sectorCounts[s]})`}
                          checked={filters.sector.includes(s)}
                          onChange={() => toggleArrayFilter("sector", s)}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  {/* Perimeter */}
                  <FilterSection title={`Perimeter (${filterOptions.perimeters.length})`} isOpen={filterSections.perimeter} onToggle={() => toggleFilterSection("perimeter")}>
                    <div className="space-y-1">
                      {filterOptions.perimeters.map(p => (
                        <FilterCheckbox
                          key={p}
                          label={`${p} (${filterOptions.perimeterCounts[p]})`}
                          checked={filters.perimeter.includes(p)}
                          onChange={() => toggleArrayFilter("perimeter", p)}
                        />
                      ))}
                    </div>
                  </FilterSection>

                  {/* Data Type */}
                  <FilterSection title={`Data Type (${filterOptions.dataTypes.length})`} isOpen={filterSections.dataType} onToggle={() => toggleFilterSection("dataType")}>
                    <div className="space-y-1">
                      {filterOptions.dataTypes.map(d => (
                        <FilterCheckbox
                          key={d}
                          label={`${d} (${filterOptions.dataTypeCounts[d]})`}
                          checked={filters.dataType.includes(d)}
                          onChange={() => toggleArrayFilter("dataType", d)}
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
                  {activeTab === "calculator" && (
                    <EmissionCalculator
                      factors={filteredFactors}
                      onSwitchToBenchmark={() => setActiveTab("benchmark")}
                    />
                  )}
                  {activeTab === "benchmark" && (
                    <BenchmarkTable
                      factors={filteredFactors}
                      onToggleFavorite={toggleFavorite}
                      onUseInCalculator={(factor) => {
                        setActiveTab("calculator");
                        toast.info(`Loaded EF: ${factor.name} (${factor.fe} kgCO₂e/${factor.unit})`, { duration: 3000 });
                      }}
                    />
                  )}
                  {activeTab === "ef-agent" && <EFAgent factors={filteredFactors} />}
                  {activeTab === "decarbo" && <DecarboAgent factors={filteredFactors} />}
                  {activeTab === "methodo" && <ClimateDataExplorer />}
                  {activeTab === "history" && <CalculationHistoryTable />}
                  {activeTab === "report" && <FarmlyReport factors={filteredFactors} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* ═══ SETTINGS DIALOG ═══ */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-lg bg-white border border-gray-200 shadow-xl rounded-xl p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-4 w-4 text-[#4F46E5]" />
              WORKSPACE SETTINGS
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
            {/* General */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Globe className="h-3 w-3" /> General
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] text-gray-700">Default unit</Label>
                  <Select value={settingsState.defaultUnit} onValueChange={v => setSettingsState(s => ({ ...s, defaultUnit: v }))}>
                    <SelectTrigger className="w-[140px] h-8 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kgCO2e">kgCO₂e</SelectItem>
                      <SelectItem value="tCO2e">tCO₂e</SelectItem>
                      <SelectItem value="gCO2e">gCO₂e</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] text-gray-700">Default region</Label>
                  <Select value={settingsState.defaultRegion} onValueChange={v => setSettingsState(s => ({ ...s, defaultRegion: v }))}>
                    <SelectTrigger className="w-[140px] h-8 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Global">Global</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="North America">North America</SelectItem>
                      <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                      <SelectItem value="South America">South America</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] text-gray-700">GWP version</Label>
                  <Select value={settingsState.gwpVersion} onValueChange={v => setSettingsState(s => ({ ...s, gwpVersion: v }))}>
                    <SelectTrigger className="w-[140px] h-8 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AR6">IPCC AR6 (2021)</SelectItem>
                      <SelectItem value="AR5">IPCC AR5 (2014)</SelectItem>
                      <SelectItem value="AR4">IPCC AR4 (2007)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Calculator */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Calculator className="h-3 w-3" /> Calculator
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[12px] text-gray-700">Auto-save calculations</Label>
                    <p className="text-[10px] text-gray-400 mt-0.5">Save every result to history</p>
                  </div>
                  <Switch checked={settingsState.autoSaveCalc} onCheckedChange={v => setSettingsState(s => ({ ...s, autoSaveCalc: v }))} className="scale-75" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[12px] text-gray-700">Show uncertainty ranges</Label>
                    <p className="text-[10px] text-gray-400 mt-0.5">Display ±% on emission factors</p>
                  </div>
                  <Switch checked={settingsState.showUncertainty} onCheckedChange={v => setSettingsState(s => ({ ...s, showUncertainty: v }))} className="scale-75" />
                </div>
              </div>
            </div>

            {/* Display */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Palette className="h-3 w-3" /> Display
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[12px] text-gray-700">Compact view</Label>
                    <p className="text-[10px] text-gray-400 mt-0.5">Reduce spacing in tables</p>
                  </div>
                  <Switch checked={settingsState.compactView} onCheckedChange={v => setSettingsState(s => ({ ...s, compactView: v }))} className="scale-75" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[12px] text-gray-700">Export format</Label>
                  <Select value={settingsState.exportFormat} onValueChange={v => setSettingsState(s => ({ ...s, exportFormat: v }))}>
                    <SelectTrigger className="w-[140px] h-8 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Bell className="h-3 w-3" /> Notifications
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[12px] text-gray-700">EF database updates</Label>
                  <p className="text-[10px] text-gray-400 mt-0.5">Get notified when new EFs are added</p>
                </div>
                <Switch checked={settingsState.notifyUpdates} onCheckedChange={v => setSettingsState(s => ({ ...s, notifyUpdates: v }))} className="scale-75" />
              </div>
            </div>

            {/* Data Sources */}
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Database className="h-3 w-3" /> Active Data Sources
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {["CBAM", "DEFRA", "IPCC", "EPA", "ecoinvent", "ICAO", "IMO", "GLEC", "sustainalize"].map(src => (
                  <div key={src} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-gray-700">{src}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
            <button onClick={() => setSettingsOpen(false)} className="px-4 py-2 text-[11px] font-semibold text-gray-500 hover:text-gray-700 rounded-lg transition-colors">
              CANCEL
            </button>
            <button onClick={() => { setSettingsOpen(false); toast.success("Settings saved"); }} className="px-4 py-2 text-[11px] font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors">
              SAVE CHANGES
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ IMPORT DIALOG ═══ */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl rounded-xl p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
              <Upload className="h-4 w-4 text-[#4F46E5]" />
              IMPORT DATA
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5 space-y-4">
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Import emission factors, calculation history, or custom datasets. Supported formats: CSV, XLSX, JSON.
            </p>

            {/* Upload zone */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#4F46E5]/30 hover:bg-[#4F46E5]/[0.02] transition-all cursor-pointer">
              <Upload className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-[12px] font-semibold text-gray-600">Drop files here or click to browse</p>
              <p className="text-[10px] text-gray-400 mt-1">CSV, XLSX, JSON up to 10MB</p>
            </div>

            {/* Quick import options */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Import</h4>
              {[
                { label: "Import from DEFRA 2024 template", icon: FileText },
                { label: "Import from EPA eGRID dataset", icon: Database },
                { label: "Import from ecoinvent export", icon: Download },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => toast.info("Import template coming soon")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-[#4F46E5]/20 hover:bg-[#4F46E5]/[0.02] transition-all text-left"
                >
                  <Icon className="h-3.5 w-3.5 text-[#4F46E5]" />
                  <span className="text-[11px] font-medium text-gray-700">{label}</span>
                  <ExternalLink className="h-3 w-3 text-gray-300 ml-auto" />
                </button>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
            <button onClick={() => setImportOpen(false)} className="px-4 py-2 text-[11px] font-semibold text-gray-500 hover:text-gray-700 rounded-lg transition-colors">
              CANCEL
            </button>
            <button onClick={() => { setImportOpen(false); toast.success("Import started"); }} className="px-4 py-2 text-[11px] font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-lg transition-colors">
              IMPORT
            </button>
          </div>
        </DialogContent>
      </Dialog>
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
