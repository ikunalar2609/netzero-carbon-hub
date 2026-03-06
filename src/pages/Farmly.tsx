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
  Code,
  Database,
  ArrowRight,
  Zap,
  BookOpen,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  Clock,
  Compass,
  PanelLeftClose,
  PanelLeft,
  Leaf,
  Settings,
  Bell,
} from "lucide-react";
import { ClimateDataExplorer } from "@/components/farmly/ClimateDataExplorer";
import { EmissionCalculator } from "@/components/farmly/EmissionCalculator";
import { CalculationHistoryTable } from "@/components/farmly/CalculationHistoryTable";
import { CarbonAccountingTemplate } from "@/components/farmly/CarbonAccountingTemplate";

const tabItems = [
  { id: "calculator", label: "Calculator", icon: Calculator },
  { id: "template", label: "CAT", icon: FileSpreadsheet },
  { id: "history", label: "History", icon: Clock },
  { id: "explorer", label: "Explorer", icon: Compass },
];

const Farmly = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filter states
  const [filterSections, setFilterSections] = useState({
    scope: true,
    methodology: true,
    region: false,
    period: false,
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
    setFilterSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
      {/* ─── Top Navigation Bar ─── */}
      <header className="h-16 bg-white border-b flex items-center px-6 shrink-0" style={{ borderColor: "#E5E7EB" }}>
        {/* Left: Logo + Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}>
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold" style={{ color: "#1E293B" }}>Farmly</span>
          </div>
          <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ background: "#EEF2FF", color: "#4F46E5" }}>
            Carbon Analytics
          </Badge>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-[560px] mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#94A3B8" }} />
          <Input
            placeholder="Search emission factors, methodologies, regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-10 border rounded-lg text-sm focus:ring-2 focus:ring-offset-0"
            style={{
              borderColor: "#E2E8F0",
              background: "#F8FAFC",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
              color: "#334155",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4" style={{ color: "#94A3B8" }} />
            </button>
          )}
        </div>

        {/* Right: Nav Links */}
        <div className="flex items-center gap-2">
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Docs", href: "/farmly/docs" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{ color: "#64748B" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F1F5F9";
                e.currentTarget.style.color = "#4F46E5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748B";
              }}
            >
              {link.label}
            </Link>
          ))}
          <Separator orientation="vertical" className="h-6 mx-1" />
          <button className="p-2 rounded-lg transition-colors hover:bg-slate-100">
            <Bell className="h-4 w-4" style={{ color: "#94A3B8" }} />
          </button>
          <button className="p-2 rounded-lg transition-colors hover:bg-slate-100">
            <Settings className="h-4 w-4" style={{ color: "#94A3B8" }} />
          </button>
        </div>
      </header>

      {/* ─── Main Body ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─── Left Sidebar (Filters Panel) ─── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-white border-r overflow-hidden shrink-0 flex flex-col"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" style={{ color: "#4F46E5" }} />
                  <span className="text-sm font-semibold" style={{ color: "#1E293B" }}>Filters</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 transition-colors"
                >
                  <PanelLeftClose className="h-4 w-4" style={{ color: "#94A3B8" }} />
                </button>
              </div>

              <ScrollArea className="flex-1 px-4">
                {/* Scope Filter */}
                <FilterSection
                  title="EMISSION SCOPE"
                  isOpen={filterSections.scope}
                  onToggle={() => toggleFilterSection("scope")}
                >
                  <FilterCheckbox label="Scope 1 — Direct" checked={filters.scope1} onChange={(v) => setFilters(f => ({ ...f, scope1: !!v }))} />
                  <FilterCheckbox label="Scope 2 — Indirect" checked={filters.scope2} onChange={(v) => setFilters(f => ({ ...f, scope2: !!v }))} />
                  <FilterCheckbox label="Scope 3 — Value Chain" checked={filters.scope3} onChange={(v) => setFilters(f => ({ ...f, scope3: !!v }))} />
                </FilterSection>

                <Separator className="my-3" style={{ background: "#F1F5F9" }} />

                {/* Methodology Filter */}
                <FilterSection
                  title="METHODOLOGY"
                  isOpen={filterSections.methodology}
                  onToggle={() => toggleFilterSection("methodology")}
                >
                  <FilterCheckbox label="GHG Protocol" checked={filters.ghgProtocol} onChange={(v) => setFilters(f => ({ ...f, ghgProtocol: !!v }))} />
                  <FilterCheckbox label="IPCC AR6" checked={filters.ipcc} onChange={(v) => setFilters(f => ({ ...f, ipcc: !!v }))} />
                  <FilterCheckbox label="DEFRA 2024" checked={filters.defra} onChange={(v) => setFilters(f => ({ ...f, defra: !!v }))} />
                </FilterSection>

                <Separator className="my-3" style={{ background: "#F1F5F9" }} />

                {/* Region Filter */}
                <FilterSection
                  title="REGION"
                  isOpen={filterSections.region}
                  onToggle={() => toggleFilterSection("region")}
                >
                  <FilterCheckbox label="Global" checked={true} onChange={() => {}} />
                  <FilterCheckbox label="Europe" checked={false} onChange={() => {}} />
                  <FilterCheckbox label="North America" checked={false} onChange={() => {}} />
                  <FilterCheckbox label="Asia Pacific" checked={false} onChange={() => {}} />
                </FilterSection>

                <Separator className="my-3" style={{ background: "#F1F5F9" }} />

                {/* Toggle Options */}
                <FilterSection
                  title="OPTIONS"
                  isOpen={filterSections.period}
                  onToggle={() => toggleFilterSection("period")}
                >
                  <div className="flex items-center justify-between py-1.5">
                    <Label className="text-xs font-normal" style={{ color: "#475569" }}>Include WTT</Label>
                    <Switch
                      checked={filters.includeWTT}
                      onCheckedChange={(v) => setFilters(f => ({ ...f, includeWTT: v }))}
                      className="scale-75"
                    />
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <Label className="text-xs font-normal" style={{ color: "#475569" }}>Radiative Forcing</Label>
                    <Switch
                      checked={filters.includeRF}
                      onCheckedChange={(v) => setFilters(f => ({ ...f, includeRF: v }))}
                      className="scale-75"
                    />
                  </div>
                </FilterSection>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ─── Main Workspace ─── */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Sidebar toggle when collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mb-4 p-2 rounded-lg bg-white border transition-colors hover:bg-slate-50"
              style={{ borderColor: "#E5E7EB" }}
            >
              <PanelLeft className="h-4 w-4" style={{ color: "#64748B" }} />
            </button>
          )}

          {/* Workspace Card */}
          <div
            className="bg-white rounded-xl overflow-hidden"
            style={{
              border: "1px solid #E5E7EB",
              boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* Action Tabs Row */}
            <div className="px-6 pt-5 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {tabItems.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                      style={{
                        background: isActive ? "#4F46E5" : "transparent",
                        color: isActive ? "#FFFFFF" : "#64748B",
                        border: isActive ? "none" : "1px solid #E2E8F0",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "#EEF2FF";
                          e.currentTarget.style.color = "#4F46E5";
                          e.currentTarget.style.borderColor = "#C7D2FE";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#64748B";
                          e.currentTarget.style.borderColor = "#E2E8F0";
                        }
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs font-medium"
                  style={{ borderColor: "#E2E8F0", color: "#64748B" }}
                  asChild
                >
                  <Link to="/farmly/docs">
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    Documentation
                  </Link>
                </Button>
              </div>
            </div>

            {/* Tab content separator */}
            <div className="px-6 pt-4">
              <Separator style={{ background: "#F1F5F9" }} />
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
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
  <div className="py-2">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-1.5 group"
    >
      <span className="text-[10px] font-semibold tracking-wider" style={{ color: "#94A3B8" }}>
        {title}
      </span>
      {isOpen ? (
        <ChevronDown className="h-3.5 w-3.5" style={{ color: "#CBD5E1" }} />
      ) : (
        <ChevronRight className="h-3.5 w-3.5" style={{ color: "#CBD5E1" }} />
      )}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="overflow-hidden"
        >
          <div className="pt-2 space-y-1.5">
            {children}
          </div>
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
  <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      className="h-3.5 w-3.5 rounded border data-[state=checked]:bg-[#4F46E5] data-[state=checked]:border-[#4F46E5]"
    />
    <span
      className="text-xs transition-colors duration-150"
      style={{ color: checked ? "#334155" : "#94A3B8" }}
    >
      {label}
    </span>
  </label>
);

export default Farmly;
