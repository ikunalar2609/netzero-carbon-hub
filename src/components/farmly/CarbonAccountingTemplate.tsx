import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSpreadsheet, 
  Building2, 
  Users, 
  Calendar,
  Link as LinkIcon,
  FileText,
  Plus,
  Trash2,
  Download,
  Save,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  AlertCircle,
  Eye,
  Edit3,
  Copy,
  Clock,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Types
interface ProjectInfo {
  projectName: string;
  projectCountry: string;
  standardBody: string;
  projectCode: string;
  projectStartDate: string;
  creditingPeriodStart: string;
  creditingPeriodEnd: string;
  commitmentPeriod: string;
}

interface ProjectEntity {
  id: string;
  role: string;
  name: string;
  contactInfo: string;
  address: string;
  telephone: string;
  email: string;
  urlSource: string;
}

interface DocumentLink {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface ExAnteRecord {
  id: string;
  creditingPeriod: number;
  vintageYear: number;
  baselineChanges: number;
  projectStockChanges: number;
  assumedLeakage: number;
  riskBufferAllocation: number;
  riskBufferRelease: number;
  paidRiskBuffer: number;
  deductedCredits: number;
  forecastIssuance: number;
  methodology: string;
  issuanceValidation: string;
}

interface ExPostRecord {
  id: string;
  creditingPeriod: number;
  vintageYear: number;
  baselineChanges: number;
  projectStockChanges: number;
  assumedLeakage: number;
  riskBufferAllocation: number;
  riskBufferRelease: number;
  paidRiskBuffer: number;
  deductedCredits: number;
  exPostIssuance: number;
  issuanceValidation: string;
  georefSource: string;
  projectOwner: string;
  projectDeveloper: string;
  projectAuditor: string;
}

interface SavedTemplate {
  id: string;
  projectInfo: ProjectInfo;
  entities: ProjectEntity[];
  documentLinks: DocumentLink[];
  exAnteRecords: ExAnteRecord[];
  exPostRecords: ExPostRecord[];
  savedAt: string;
  lastModified: string;
}

// Constants
const standardBodies = [
  "Verra (VCS)",
  "Gold Standard",
  "American Carbon Registry",
  "Climate Action Reserve",
  "Plan Vivo",
  "ART TREES",
  "Other"
];

const entityRoles = [
  "Project Owner",
  "Project Developer/Proponent", 
  "Project Auditor/VVB",
  "Validation Body",
  "Verification Body",
  "Other"
];

const commitmentPeriods = ["20", "30", "40", "50", "100", "Permanent"];

const documentTypes = [
  "Project Design Document (PDD)",
  "Validation Report",
  "Verification Report", 
  "Monitoring Report",
  "Non-Permanence Risk Assessment",
  "Cancellation Certificate",
  "Other"
];

// Helper Components
const FieldLabel = ({ children, tooltip, required }: { children: React.ReactNode; tooltip?: string; required?: boolean }) => (
  <Label className="flex items-center gap-1 text-xs font-medium text-gray-700">
    {children}
    {required && <span className="text-red-500">*</span>}
    {tooltip && (
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-3 w-3 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
      </Tooltip>
    )}
  </Label>
);

const SectionHeader = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  badge,
  isOpen, 
  onToggle 
}: { 
  icon: React.ElementType; 
  title: string; 
  subtitle?: string;
  badge?: string | number;
  isOpen: boolean; 
  onToggle: () => void;
}) => (
  <div 
    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
    onClick={onToggle}
  >
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-emerald-50">
        <Icon className="h-5 w-5 text-emerald-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {badge !== undefined && (
        <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
          {badge}
        </Badge>
      )}
    </div>
    {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
  </div>
);

// Main Component
export const CarbonAccountingTemplate = () => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    projectName: "",
    projectCountry: "",
    standardBody: "",
    projectCode: "",
    projectStartDate: "",
    creditingPeriodStart: "",
    creditingPeriodEnd: "",
    commitmentPeriod: "",
  });

  const [entities, setEntities] = useState<ProjectEntity[]>([
    { id: "1", role: "Project Owner", name: "", contactInfo: "", address: "", telephone: "", email: "", urlSource: "" }
  ]);

  const [documentLinks, setDocumentLinks] = useState<DocumentLink[]>([]);
  const [exAnteRecords, setExAnteRecords] = useState<ExAnteRecord[]>([]);
  const [exPostRecords, setExPostRecords] = useState<ExPostRecord[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SavedTemplate | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "view">("edit");

  const [expandedSections, setExpandedSections] = useState({
    projectInfo: true,
    entities: true,
    documents: false,
    exAnte: true,
    exPost: true,
    savedRecords: false,
  });

  // Load saved templates on mount
  useEffect(() => {
    const saved = localStorage.getItem('carbon-accounting-templates');
    if (saved) {
      setSavedTemplates(JSON.parse(saved));
    }
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Entity Management
  const addEntity = () => {
    setEntities([...entities, {
      id: Date.now().toString(),
      role: "",
      name: "",
      contactInfo: "",
      address: "",
      telephone: "",
      email: "",
      urlSource: "",
    }]);
  };

  const removeEntity = (id: string) => {
    if (entities.length > 1) {
      setEntities(entities.filter(e => e.id !== id));
    }
  };

  const updateEntity = (id: string, field: keyof ProjectEntity, value: string) => {
    setEntities(entities.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Document Links Management
  const addDocumentLink = () => {
    setDocumentLinks([...documentLinks, {
      id: Date.now().toString(),
      name: "",
      url: "",
      type: "",
    }]);
  };

  const removeDocumentLink = (id: string) => {
    setDocumentLinks(documentLinks.filter(d => d.id !== id));
  };

  const updateDocumentLink = (id: string, field: keyof DocumentLink, value: string) => {
    setDocumentLinks(documentLinks.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // Ex Ante Records Management
  const addExAnteRecord = () => {
    const currentYear = new Date().getFullYear();
    setExAnteRecords([...exAnteRecords, {
      id: Date.now().toString(),
      creditingPeriod: exAnteRecords.length + 1,
      vintageYear: currentYear,
      baselineChanges: 0,
      projectStockChanges: 0,
      assumedLeakage: 0,
      riskBufferAllocation: 0,
      riskBufferRelease: 0,
      paidRiskBuffer: 0,
      deductedCredits: 0,
      forecastIssuance: 0,
      methodology: "",
      issuanceValidation: "",
    }]);
  };

  const removeExAnteRecord = (id: string) => {
    setExAnteRecords(exAnteRecords.filter(r => r.id !== id));
  };

  const updateExAnteRecord = (id: string, field: keyof ExAnteRecord, value: number | string) => {
    setExAnteRecords(exAnteRecords.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Ex Post Records Management  
  const addExPostRecord = () => {
    const currentYear = new Date().getFullYear();
    setExPostRecords([...exPostRecords, {
      id: Date.now().toString(),
      creditingPeriod: exPostRecords.length + 1,
      vintageYear: currentYear,
      baselineChanges: 0,
      projectStockChanges: 0,
      assumedLeakage: 0,
      riskBufferAllocation: 0,
      riskBufferRelease: 0,
      paidRiskBuffer: 0,
      deductedCredits: 0,
      exPostIssuance: 0,
      issuanceValidation: "",
      georefSource: "",
      projectOwner: entities.find(e => e.role === "Project Owner")?.name || "",
      projectDeveloper: entities.find(e => e.role === "Project Developer/Proponent")?.name || "",
      projectAuditor: entities.find(e => e.role === "Project Auditor/VVB")?.name || "",
    }]);
  };

  const removeExPostRecord = (id: string) => {
    setExPostRecords(exPostRecords.filter(r => r.id !== id));
  };

  const updateExPostRecord = (id: string, field: keyof ExPostRecord, value: number | string) => {
    setExPostRecords(exPostRecords.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Calculate Totals
  const calculateExAnteTotals = () => {
    return exAnteRecords.reduce((acc, r) => ({
      baselineChanges: acc.baselineChanges + r.baselineChanges,
      projectStockChanges: acc.projectStockChanges + r.projectStockChanges,
      assumedLeakage: acc.assumedLeakage + r.assumedLeakage,
      riskBufferAllocation: acc.riskBufferAllocation + r.riskBufferAllocation,
      riskBufferRelease: acc.riskBufferRelease + r.riskBufferRelease,
      paidRiskBuffer: acc.paidRiskBuffer + r.paidRiskBuffer,
      deductedCredits: acc.deductedCredits + r.deductedCredits,
      forecastIssuance: acc.forecastIssuance + r.forecastIssuance,
    }), {
      baselineChanges: 0, projectStockChanges: 0, assumedLeakage: 0,
      riskBufferAllocation: 0, riskBufferRelease: 0, paidRiskBuffer: 0,
      deductedCredits: 0, forecastIssuance: 0,
    });
  };

  const calculateExPostTotals = () => {
    return exPostRecords.reduce((acc, r) => ({
      baselineChanges: acc.baselineChanges + r.baselineChanges,
      projectStockChanges: acc.projectStockChanges + r.projectStockChanges,
      assumedLeakage: acc.assumedLeakage + r.assumedLeakage,
      riskBufferAllocation: acc.riskBufferAllocation + r.riskBufferAllocation,
      riskBufferRelease: acc.riskBufferRelease + r.riskBufferRelease,
      paidRiskBuffer: acc.paidRiskBuffer + r.paidRiskBuffer,
      deductedCredits: acc.deductedCredits + r.deductedCredits,
      exPostIssuance: acc.exPostIssuance + r.exPostIssuance,
    }), {
      baselineChanges: 0, projectStockChanges: 0, assumedLeakage: 0,
      riskBufferAllocation: 0, riskBufferRelease: 0, paidRiskBuffer: 0,
      deductedCredits: 0, exPostIssuance: 0,
    });
  };

  // Save Template
  const saveTemplate = () => {
    if (!projectInfo.projectName) {
      toast.error("Please enter a project name");
      return;
    }

    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      projectInfo,
      entities,
      documentLinks,
      exAnteRecords,
      exPostRecords,
      savedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('carbon-accounting-templates', JSON.stringify(updatedTemplates));
    toast.success(`Template "${projectInfo.projectName}" saved successfully`);
  };

  // Load Template
  const loadTemplate = (template: SavedTemplate) => {
    setProjectInfo(template.projectInfo);
    setEntities(template.entities);
    setDocumentLinks(template.documentLinks);
    setExAnteRecords(template.exAnteRecords);
    setExPostRecords(template.exPostRecords);
    setSelectedTemplate(template);
    setViewMode("edit");
    toast.success(`Loaded template "${template.projectInfo.projectName}"`);
  };

  // Delete Template
  const deleteTemplate = (id: string) => {
    const updatedTemplates = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('carbon-accounting-templates', JSON.stringify(updatedTemplates));
    toast.success("Template deleted");
  };

  // Export to CSV
  const exportToCSV = () => {
    const exAnteTotals = calculateExAnteTotals();
    const exPostTotals = calculateExPostTotals();
    
    let csv = "BeZero Carbon - Carbon Accounting Template Export\n";
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    // Project Information
    csv += "=== SECTION 1: PROJECT INFORMATION ===\n";
    csv += "Field,Value\n";
    csv += `1.1.1 Project Name,${projectInfo.projectName}\n`;
    csv += `1.1.2 Project Country,${projectInfo.projectCountry}\n`;
    csv += `1.1.3 Standard Body,${projectInfo.standardBody}\n`;
    csv += `1.1.4 Project Code,${projectInfo.projectCode}\n`;
    csv += `1.1.5 Project Start Date,${projectInfo.projectStartDate}\n`;
    csv += `1.1.6 Crediting Period Start,${projectInfo.creditingPeriodStart}\n`;
    csv += `1.1.7 Crediting Period End,${projectInfo.creditingPeriodEnd}\n`;
    csv += `1.1.8 Commitment Period (years),${projectInfo.commitmentPeriod}\n\n`;
    
    // Project Entities
    csv += "=== TABLE 1.2: PROJECT ENTITIES ===\n";
    csv += "Role,Legal Name,Contact Person,Address,Telephone,Email,URL Source\n";
    entities.forEach(e => {
      csv += `"${e.role}","${e.name}","${e.contactInfo}","${e.address}","${e.telephone}","${e.email}","${e.urlSource}"\n`;
    });
    csv += "\n";

    // Document Links
    if (documentLinks.length > 0) {
      csv += "=== TABLE 1.3: DOCUMENTATION LINKS ===\n";
      csv += "Document Type,Document Name,URL\n";
      documentLinks.forEach(d => {
        csv += `"${d.type}","${d.name}","${d.url}"\n`;
      });
      csv += "\n";
    }
    
    // Ex Ante Records
    csv += "=== TABLE 2.1: FORECAST ISSUANCE (EX ANTE) ===\n";
    csv += "Crediting Period,Vintage Year,Baseline Changes (tCO2e),Project Stock Changes (tCO2e),Assumed Leakage (tCO2e),Risk Buffer Allocation (tCO2e),Risk Buffer Release (tCO2e),Paid Risk Buffer (tCO2e),Deducted Credits (tCO2e),Forecast Issuance (tCO2e),Methodology,Issuance Validation\n";
    exAnteRecords.forEach(r => {
      csv += `${r.creditingPeriod},${r.vintageYear},${r.baselineChanges},${r.projectStockChanges},${r.assumedLeakage},${r.riskBufferAllocation},${r.riskBufferRelease},${r.paidRiskBuffer},${r.deductedCredits},${r.forecastIssuance},"${r.methodology}","${r.issuanceValidation}"\n`;
    });
    csv += `TOTAL,-,${exAnteTotals.baselineChanges},${exAnteTotals.projectStockChanges},${exAnteTotals.assumedLeakage},${exAnteTotals.riskBufferAllocation},${exAnteTotals.riskBufferRelease},${exAnteTotals.paidRiskBuffer},${exAnteTotals.deductedCredits},${exAnteTotals.forecastIssuance},-,-\n\n`;

    // Ex Post Records
    csv += "=== TABLE 2.2: EX POST ISSUANCE ===\n";
    csv += "Crediting Period,Vintage Year,Baseline Changes (tCO2e),Project Stock Changes (tCO2e),Assumed Leakage (tCO2e),Risk Buffer Allocation (tCO2e),Risk Buffer Release (tCO2e),Paid Risk Buffer (tCO2e),Deducted Credits (tCO2e),Ex Post Issuance (tCO2e),Issuance Validation,Georef Source,Project Owner,Project Developer,Project Auditor\n";
    exPostRecords.forEach(r => {
      csv += `${r.creditingPeriod},${r.vintageYear},${r.baselineChanges},${r.projectStockChanges},${r.assumedLeakage},${r.riskBufferAllocation},${r.riskBufferRelease},${r.paidRiskBuffer},${r.deductedCredits},${r.exPostIssuance},"${r.issuanceValidation}","${r.georefSource}","${r.projectOwner}","${r.projectDeveloper}","${r.projectAuditor}"\n`;
    });
    csv += `TOTAL,-,${exPostTotals.baselineChanges},${exPostTotals.projectStockChanges},${exPostTotals.assumedLeakage},${exPostTotals.riskBufferAllocation},${exPostTotals.riskBufferRelease},${exPostTotals.paidRiskBuffer},${exPostTotals.deductedCredits},${exPostTotals.exPostIssuance},-,-,-,-,-\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CAT-${projectInfo.projectName || 'template'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template exported to CSV");
  };

  // Clear Form
  const clearForm = () => {
    setProjectInfo({
      projectName: "", projectCountry: "", standardBody: "", projectCode: "",
      projectStartDate: "", creditingPeriodStart: "", creditingPeriodEnd: "", commitmentPeriod: "",
    });
    setEntities([{ id: "1", role: "Project Owner", name: "", contactInfo: "", address: "", telephone: "", email: "", urlSource: "" }]);
    setDocumentLinks([]);
    setExAnteRecords([]);
    setExPostRecords([]);
    setSelectedTemplate(null);
    toast.success("Form cleared");
  };

  const exAnteTotals = calculateExAnteTotals();
  const exPostTotals = calculateExPostTotals();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Carbon Accounting Template
              </h2>
              <p className="text-sm text-gray-600">
                BeZero Carbon standardized format for carbon project reporting
                {" · "}
                <RouterLink to="docs?section=cat" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
                  Read Documentation
                </RouterLink>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={clearForm} className="text-gray-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={saveTemplate} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} className="text-blue-600 border-blue-200 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {(exAnteRecords.length > 0 || exPostRecords.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-emerald-700">
                  {exAnteTotals.forecastIssuance.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600 font-medium">Forecast Issuance (tCO₂e)</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-700">
                  {exPostTotals.exPostIssuance.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 font-medium">Ex Post Issuance (tCO₂e)</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-700">
                  {(exAnteTotals.riskBufferAllocation + exPostTotals.riskBufferAllocation).toLocaleString()}
                </div>
                <div className="text-xs text-amber-600 font-medium">Risk Buffer (tCO₂e)</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-700">
                  {exAnteRecords.length + exPostRecords.length}
                </div>
                <div className="text-xs text-purple-600 font-medium">Total Vintages</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Saved Templates Section */}
        {savedTemplates.length > 0 && (
          <Collapsible open={expandedSections.savedRecords} onOpenChange={() => toggleSection('savedRecords')}>
            <Card className="border-gray-200">
              <SectionHeader
                icon={Clock}
                title="Saved Templates"
                subtitle="Previously saved carbon accounting templates"
                badge={savedTemplates.length}
                isOpen={expandedSections.savedRecords}
                onToggle={() => toggleSection('savedRecords')}
              />
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold">Project Name</TableHead>
                          <TableHead className="font-semibold">Standard</TableHead>
                          <TableHead className="font-semibold">Country</TableHead>
                          <TableHead className="font-semibold text-right">Forecast (tCO₂e)</TableHead>
                          <TableHead className="font-semibold text-right">Ex Post (tCO₂e)</TableHead>
                          <TableHead className="font-semibold">Saved</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedTemplates.map((template) => {
                          const templateExAnteTotals = template.exAnteRecords.reduce((acc, r) => acc + r.forecastIssuance, 0);
                          const templateExPostTotals = template.exPostRecords.reduce((acc, r) => acc + r.exPostIssuance, 0);
                          return (
                            <TableRow key={template.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{template.projectInfo.projectName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {template.projectInfo.standardBody || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell>{template.projectInfo.projectCountry || "N/A"}</TableCell>
                              <TableCell className="text-right font-mono text-emerald-600">
                                {templateExAnteTotals.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-mono text-blue-600">
                                {templateExPostTotals.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-gray-500 text-sm">
                                {new Date(template.savedAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Eye className="h-4 w-4 text-gray-500" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                          <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                                          {template.projectInfo.projectName}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <TemplatePreview template={template} />
                                    </DialogContent>
                                  </Dialog>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => loadTemplate(template)}>
                                    <Edit3 className="h-4 w-4 text-blue-500" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => deleteTemplate(template.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Section 1: Project Information */}
        <Collapsible open={expandedSections.projectInfo} onOpenChange={() => toggleSection('projectInfo')}>
          <Card className="border-gray-200">
            <SectionHeader
              icon={Building2}
              title="Section 1.1: Project Information"
              subtitle="Basic project details as registered under the standard body"
              isOpen={expandedSections.projectInfo}
              onToggle={() => toggleSection('projectInfo')}
            />
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <FieldLabel tooltip="Project name as registered under the standard body" required>
                      1.1.1 Project Name
                    </FieldLabel>
                    <Input 
                      value={projectInfo.projectName}
                      onChange={(e) => setProjectInfo({ ...projectInfo, projectName: e.target.value })}
                      placeholder="e.g., Amazon REDD+ Project"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel tooltip="Country(ies) of project location using ISO-3 format" required>
                      1.1.2 Project Country
                    </FieldLabel>
                    <Input 
                      value={projectInfo.projectCountry}
                      onChange={(e) => setProjectInfo({ ...projectInfo, projectCountry: e.target.value })}
                      placeholder="e.g., BRA"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel tooltip="Standard body legal name">
                      1.1.3 Standard Body
                    </FieldLabel>
                    <Select 
                      value={projectInfo.standardBody}
                      onValueChange={(value) => setProjectInfo({ ...projectInfo, standardBody: value })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {standardBodies.map(body => (
                          <SelectItem key={body} value={body}>{body}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <FieldLabel tooltip="Project code as displayed on the registry">
                      1.1.4 Project Code
                    </FieldLabel>
                    <Input 
                      value={projectInfo.projectCode}
                      onChange={(e) => setProjectInfo({ ...projectInfo, projectCode: e.target.value })}
                      placeholder="e.g., VCS-1234"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel tooltip="Start date of the project activities">
                      1.1.5 Project Start Date
                    </FieldLabel>
                    <Input 
                      type="date"
                      value={projectInfo.projectStartDate}
                      onChange={(e) => setProjectInfo({ ...projectInfo, projectStartDate: e.target.value })}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel tooltip="First date the project is accredited to claim credits">
                      1.1.6 Crediting Period Start
                    </FieldLabel>
                    <Input 
                      type="date"
                      value={projectInfo.creditingPeriodStart}
                      onChange={(e) => setProjectInfo({ ...projectInfo, creditingPeriodStart: e.target.value })}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel tooltip="Last date the project is accredited to claim credits">
                      1.1.7 Crediting Period End
                    </FieldLabel>
                    <Input 
                      type="date"
                      value={projectInfo.creditingPeriodEnd}
                      onChange={(e) => setProjectInfo({ ...projectInfo, creditingPeriodEnd: e.target.value })}
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel tooltip="Duration of time a project ensures the permanence of a credit">
                      1.1.8 Commitment Period
                    </FieldLabel>
                    <Select 
                      value={projectInfo.commitmentPeriod}
                      onValueChange={(value) => setProjectInfo({ ...projectInfo, commitmentPeriod: value })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Years" />
                      </SelectTrigger>
                      <SelectContent>
                        {commitmentPeriods.map(period => (
                          <SelectItem key={period} value={period}>{period} years</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Section 1.2: Project Entities */}
        <Collapsible open={expandedSections.entities} onOpenChange={() => toggleSection('entities')}>
          <Card className="border-gray-200">
            <SectionHeader
              icon={Users}
              title="Table 1.2: Project Entities"
              subtitle="Project stakeholders and their contact information"
              badge={entities.length}
              isOpen={expandedSections.entities}
              onToggle={() => toggleSection('entities')}
            />
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {entities.map((entity, index) => (
                  <motion.div 
                    key={entity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Entity {index + 1}</span>
                      {entities.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeEntity(entity.id)} className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      <div className="space-y-1">
                        <FieldLabel>Role</FieldLabel>
                        <Select value={entity.role} onValueChange={(value) => updateEntity(entity.id, 'role', value)}>
                          <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {entityRoles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <FieldLabel>Legal Name</FieldLabel>
                        <Input className="h-9" value={entity.name} onChange={(e) => updateEntity(entity.id, 'name', e.target.value)} placeholder="Company name" />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel>Contact Person</FieldLabel>
                        <Input className="h-9" value={entity.contactInfo} onChange={(e) => updateEntity(entity.id, 'contactInfo', e.target.value)} placeholder="Full name" />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel>Address</FieldLabel>
                        <Input className="h-9" value={entity.address} onChange={(e) => updateEntity(entity.id, 'address', e.target.value)} placeholder="Full address" />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel>Telephone</FieldLabel>
                        <Input className="h-9" value={entity.telephone} onChange={(e) => updateEntity(entity.id, 'telephone', e.target.value)} placeholder="+1 234 567 8900" />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel>Email</FieldLabel>
                        <Input className="h-9" type="email" value={entity.email} onChange={(e) => updateEntity(entity.id, 'email', e.target.value)} placeholder="email@company.com" />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel>Website URL</FieldLabel>
                        <Input className="h-9" value={entity.urlSource} onChange={(e) => updateEntity(entity.id, 'urlSource', e.target.value)} placeholder="https://" />
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button variant="outline" size="sm" onClick={addEntity} className="w-full border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entity
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Section 1.3: Document Links */}
        <Collapsible open={expandedSections.documents} onOpenChange={() => toggleSection('documents')}>
          <Card className="border-gray-200">
            <SectionHeader
              icon={LinkIcon}
              title="Table 1.3: Documentation Links"
              subtitle="Links to publicly available project documents"
              badge={documentLinks.length}
              isOpen={expandedSections.documents}
              onToggle={() => toggleSection('documents')}
            />
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {documentLinks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <LinkIcon className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No documents linked yet</p>
                  </div>
                ) : (
                  documentLinks.map((doc, index) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50/50">
                      <span className="text-xs font-medium text-gray-500 w-8">1.3.{index + 1}</span>
                      <Select value={doc.type} onValueChange={(value) => updateDocumentLink(doc.id, 'type', value)}>
                        <SelectTrigger className="h-9 w-48"><SelectValue placeholder="Document type" /></SelectTrigger>
                        <SelectContent>
                          {documentTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Input className="h-9 flex-1" value={doc.name} onChange={(e) => updateDocumentLink(doc.id, 'name', e.target.value)} placeholder="Document name" />
                      <Input className="h-9 flex-1" value={doc.url} onChange={(e) => updateDocumentLink(doc.id, 'url', e.target.value)} placeholder="https://..." />
                      <Button variant="ghost" size="sm" onClick={() => removeDocumentLink(doc.id)} className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
                <Button variant="outline" size="sm" onClick={addDocumentLink} className="w-full border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document Link
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Section 2.1: Ex Ante Carbon Accounting */}
        <Collapsible open={expandedSections.exAnte} onOpenChange={() => toggleSection('exAnte')}>
          <Card className="border-gray-200">
            <SectionHeader
              icon={Calendar}
              title="Table 2.1: Forecast Issuance (Ex Ante)"
              subtitle="Data from project description, validation report, and risk assessment"
              badge={`${exAnteRecords.length} vintages`}
              isOpen={expandedSections.exAnte}
              onToggle={() => toggleSection('exAnte')}
            />
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {exAnteRecords.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No ex ante records yet</p>
                    <p className="text-sm mt-1">Add vintage years to start tracking forecast carbon accounting</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-emerald-50">
                        <TableRow>
                          <TableHead className="text-xs font-semibold w-20">2.1.1<br/>Period</TableHead>
                          <TableHead className="text-xs font-semibold w-20">2.1.2<br/>Vintage</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.1.3<br/>Baseline Δ</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.1.4<br/>Project Δ</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.1.5<br/>Leakage</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.1.6<br/>Buffer Alloc</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.1.7<br/>Buffer Rel</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.1.8<br/>Paid Buffer</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.1.9<br/>Deducted</TableHead>
                          <TableHead className="text-xs font-semibold text-right bg-emerald-100">2.1.10<br/>Forecast</TableHead>
                          <TableHead className="text-xs font-semibold">2.1.11<br/>Methodology</TableHead>
                          <TableHead className="text-xs font-semibold w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exAnteRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell><Input type="number" className="h-8 w-16 text-center text-sm" value={record.creditingPeriod} onChange={(e) => updateExAnteRecord(record.id, 'creditingPeriod', parseInt(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-20 text-center text-sm" value={record.vintageYear} onChange={(e) => updateExAnteRecord(record.id, 'vintageYear', parseInt(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.baselineChanges} onChange={(e) => updateExAnteRecord(record.id, 'baselineChanges', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.projectStockChanges} onChange={(e) => updateExAnteRecord(record.id, 'projectStockChanges', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.assumedLeakage} onChange={(e) => updateExAnteRecord(record.id, 'assumedLeakage', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.riskBufferAllocation} onChange={(e) => updateExAnteRecord(record.id, 'riskBufferAllocation', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.riskBufferRelease} onChange={(e) => updateExAnteRecord(record.id, 'riskBufferRelease', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.paidRiskBuffer} onChange={(e) => updateExAnteRecord(record.id, 'paidRiskBuffer', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.deductedCredits} onChange={(e) => updateExAnteRecord(record.id, 'deductedCredits', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell className="bg-emerald-50"><Input type="number" className="h-8 w-24 text-right text-sm bg-emerald-50 font-medium" value={record.forecastIssuance} onChange={(e) => updateExAnteRecord(record.id, 'forecastIssuance', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input className="h-8 w-32 text-sm" value={record.methodology} onChange={(e) => updateExAnteRecord(record.id, 'methodology', e.target.value)} placeholder="e.g., VM0007" /></TableCell>
                            <TableCell><Button variant="ghost" size="sm" onClick={() => removeExAnteRecord(record.id)} className="h-8 w-8 p-0"><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-emerald-100 font-semibold">
                          <TableCell colSpan={2} className="text-sm">TOTAL</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exAnteTotals.baselineChanges.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exAnteTotals.projectStockChanges.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exAnteTotals.assumedLeakage.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exAnteTotals.riskBufferAllocation.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exAnteTotals.riskBufferRelease.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exAnteTotals.paidRiskBuffer.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exAnteTotals.deductedCredits.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono bg-emerald-200">{exAnteTotals.forecastIssuance.toLocaleString()}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={addExAnteRecord} className="w-full border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ex Ante Vintage Year
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Section 2.2: Ex Post Carbon Accounting */}
        <Collapsible open={expandedSections.exPost} onOpenChange={() => toggleSection('exPost')}>
          <Card className="border-gray-200">
            <SectionHeader
              icon={Check}
              title="Table 2.2: Ex Post Issuance"
              subtitle="Data from monitoring & verification reports"
              badge={`${exPostRecords.length} vintages`}
              isOpen={expandedSections.exPost}
              onToggle={() => toggleSection('exPost')}
            />
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {exPostRecords.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Check className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No ex post records yet</p>
                    <p className="text-sm mt-1">Add vintage years to track verified carbon accounting</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-blue-50">
                        <TableRow>
                          <TableHead className="text-xs font-semibold w-20">2.2.1<br/>Period</TableHead>
                          <TableHead className="text-xs font-semibold w-20">2.2.2<br/>Vintage</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.2.3<br/>Baseline Δ</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.2.4<br/>Project Δ</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.2.5<br/>Leakage</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.2.6<br/>Buffer Alloc</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.2.7<br/>Buffer Rel</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.2.8<br/>Paid Buffer</TableHead>
                          <TableHead className="text-xs font-semibold text-right">2.2.9<br/>Deducted</TableHead>
                          <TableHead className="text-xs font-semibold text-right bg-blue-100">2.2.10<br/>Ex Post</TableHead>
                          <TableHead className="text-xs font-semibold">2.2.12<br/>Georef</TableHead>
                          <TableHead className="text-xs font-semibold w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exPostRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell><Input type="number" className="h-8 w-16 text-center text-sm" value={record.creditingPeriod} onChange={(e) => updateExPostRecord(record.id, 'creditingPeriod', parseInt(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-20 text-center text-sm" value={record.vintageYear} onChange={(e) => updateExPostRecord(record.id, 'vintageYear', parseInt(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.baselineChanges} onChange={(e) => updateExPostRecord(record.id, 'baselineChanges', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.projectStockChanges} onChange={(e) => updateExPostRecord(record.id, 'projectStockChanges', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.assumedLeakage} onChange={(e) => updateExPostRecord(record.id, 'assumedLeakage', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.riskBufferAllocation} onChange={(e) => updateExPostRecord(record.id, 'riskBufferAllocation', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.riskBufferRelease} onChange={(e) => updateExPostRecord(record.id, 'riskBufferRelease', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.paidRiskBuffer} onChange={(e) => updateExPostRecord(record.id, 'paidRiskBuffer', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input type="number" className="h-8 w-24 text-right text-sm" value={record.deductedCredits} onChange={(e) => updateExPostRecord(record.id, 'deductedCredits', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell className="bg-blue-50"><Input type="number" className="h-8 w-24 text-right text-sm bg-blue-50 font-medium" value={record.exPostIssuance} onChange={(e) => updateExPostRecord(record.id, 'exPostIssuance', parseFloat(e.target.value) || 0)} /></TableCell>
                            <TableCell><Input className="h-8 w-32 text-sm" value={record.georefSource} onChange={(e) => updateExPostRecord(record.id, 'georefSource', e.target.value)} placeholder="URL link" /></TableCell>
                            <TableCell><Button variant="ghost" size="sm" onClick={() => removeExPostRecord(record.id)} className="h-8 w-8 p-0"><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-blue-100 font-semibold">
                          <TableCell colSpan={2} className="text-sm">TOTAL</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exPostTotals.baselineChanges.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exPostTotals.projectStockChanges.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exPostTotals.assumedLeakage.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exPostTotals.riskBufferAllocation.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exPostTotals.riskBufferRelease.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exPostTotals.paidRiskBuffer.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono">{exPostTotals.deductedCredits.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-mono bg-blue-200">{exPostTotals.exPostIssuance.toLocaleString()}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={addExPostRecord} className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ex Post Vintage Year
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 py-4">
          <p>Based on BeZero Carbon's Carbon Accounting Template (CAT) v1.0</p>
          <p className="mt-1">Data should be in accordance with publicly available project documentation.</p>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Template Preview Component
const TemplatePreview = ({ template }: { template: SavedTemplate }) => {
  const exAnteTotals = template.exAnteRecords.reduce((acc, r) => ({
    forecastIssuance: acc.forecastIssuance + r.forecastIssuance,
    baselineChanges: acc.baselineChanges + r.baselineChanges,
  }), { forecastIssuance: 0, baselineChanges: 0 });

  const exPostTotals = template.exPostRecords.reduce((acc, r) => ({
    exPostIssuance: acc.exPostIssuance + r.exPostIssuance,
    baselineChanges: acc.baselineChanges + r.baselineChanges,
  }), { exPostIssuance: 0, baselineChanges: 0 });

  return (
    <div className="space-y-6">
      {/* Project Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="text-xs text-gray-500">Project Name</div>
          <div className="font-medium">{template.projectInfo.projectName}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Standard Body</div>
          <div className="font-medium">{template.projectInfo.standardBody || "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Country</div>
          <div className="font-medium">{template.projectInfo.projectCountry || "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Project Code</div>
          <div className="font-medium">{template.projectInfo.projectCode || "N/A"}</div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-700">{exAnteTotals.forecastIssuance.toLocaleString()}</div>
            <div className="text-xs text-emerald-600">Forecast Issuance (tCO₂e)</div>
            <div className="text-xs text-gray-500 mt-1">{template.exAnteRecords.length} vintages</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-700">{exPostTotals.exPostIssuance.toLocaleString()}</div>
            <div className="text-xs text-blue-600">Ex Post Issuance (tCO₂e)</div>
            <div className="text-xs text-gray-500 mt-1">{template.exPostRecords.length} vintages</div>
          </CardContent>
        </Card>
      </div>

      {/* Entities */}
      {template.entities.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Project Entities</h4>
          <div className="space-y-2">
            {template.entities.filter(e => e.name).map((entity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <Badge variant="outline" className="text-xs">{entity.role}</Badge>
                <span className="text-sm font-medium">{entity.name}</span>
                {entity.email && <span className="text-xs text-gray-500">{entity.email}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ex Ante Table Preview */}
      {template.exAnteRecords.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Ex Ante Records</h4>
          <Table>
            <TableHeader className="bg-emerald-50">
              <TableRow>
                <TableHead className="text-xs">Period</TableHead>
                <TableHead className="text-xs">Vintage</TableHead>
                <TableHead className="text-xs text-right">Baseline Δ</TableHead>
                <TableHead className="text-xs text-right">Forecast</TableHead>
                <TableHead className="text-xs">Methodology</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {template.exAnteRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm">{r.creditingPeriod}</TableCell>
                  <TableCell className="text-sm">{r.vintageYear}</TableCell>
                  <TableCell className="text-sm text-right font-mono">{r.baselineChanges.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-right font-mono text-emerald-600">{r.forecastIssuance.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{r.methodology}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Ex Post Table Preview */}
      {template.exPostRecords.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Ex Post Records</h4>
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead className="text-xs">Period</TableHead>
                <TableHead className="text-xs">Vintage</TableHead>
                <TableHead className="text-xs text-right">Baseline Δ</TableHead>
                <TableHead className="text-xs text-right">Ex Post</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {template.exPostRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm">{r.creditingPeriod}</TableCell>
                  <TableCell className="text-sm">{r.vintageYear}</TableCell>
                  <TableCell className="text-sm text-right font-mono">{r.baselineChanges.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-right font-mono text-blue-600">{r.exPostIssuance.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-xs text-gray-400 text-center pt-4 border-t">
        Saved: {new Date(template.savedAt).toLocaleString()}
      </div>
    </div>
  );
};
