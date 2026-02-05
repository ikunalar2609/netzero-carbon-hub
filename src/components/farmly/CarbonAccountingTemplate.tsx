 import { useState } from "react";
 import { motion } from "framer-motion";
 import { 
   FileSpreadsheet, 
   Building2, 
   Users, 
   Calendar,
   Globe,
   FileText,
   Plus,
   Trash2,
   Download,
   Save,
   ChevronDown,
   ChevronUp,
   Info
 } from "lucide-react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Badge } from "@/components/ui/badge";
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
 import { toast } from "sonner";
 
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
 
 interface VintageRecord {
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
   exPostIssuance: number;
   georefSource: string;
 }
 
 const standardBodies = [
   "Verra (VCS)",
   "Gold Standard",
   "American Carbon Registry",
   "Climate Action Reserve",
   "Plan Vivo",
   "Other"
 ];
 
 const entityRoles = [
   "Project Owner",
   "Project Developer/Proponent",
   "Project Auditor/VVB",
   "Other"
 ];
 
 const commitmentPeriods = ["20", "30", "40", "50", "100", "Permanent"];
 
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
 
   const [vintageRecords, setVintageRecords] = useState<VintageRecord[]>([]);
 
   const [expandedSections, setExpandedSections] = useState({
     projectInfo: true,
     entities: true,
     carbonAccounting: true,
   });
 
   const toggleSection = (section: keyof typeof expandedSections) => {
     setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
   };
 
   const addEntity = () => {
     const newEntity: ProjectEntity = {
       id: Date.now().toString(),
       role: "",
       name: "",
       contactInfo: "",
       address: "",
       telephone: "",
       email: "",
       urlSource: "",
     };
     setEntities([...entities, newEntity]);
   };
 
   const removeEntity = (id: string) => {
     if (entities.length > 1) {
       setEntities(entities.filter(e => e.id !== id));
     }
   };
 
   const updateEntity = (id: string, field: keyof ProjectEntity, value: string) => {
     setEntities(entities.map(e => e.id === id ? { ...e, [field]: value } : e));
   };
 
   const addVintageRecord = () => {
     const currentYear = new Date().getFullYear();
     const newRecord: VintageRecord = {
       id: Date.now().toString(),
       creditingPeriod: vintageRecords.length + 1,
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
       exPostIssuance: 0,
       georefSource: "",
     };
     setVintageRecords([...vintageRecords, newRecord]);
   };
 
   const removeVintageRecord = (id: string) => {
     setVintageRecords(vintageRecords.filter(r => r.id !== id));
   };
 
   const updateVintageRecord = (id: string, field: keyof VintageRecord, value: number | string) => {
     setVintageRecords(vintageRecords.map(r => r.id === id ? { ...r, [field]: value } : r));
   };
 
   const calculateTotals = () => {
     return vintageRecords.reduce((acc, record) => ({
       baselineChanges: acc.baselineChanges + record.baselineChanges,
       projectStockChanges: acc.projectStockChanges + record.projectStockChanges,
       assumedLeakage: acc.assumedLeakage + record.assumedLeakage,
       riskBufferAllocation: acc.riskBufferAllocation + record.riskBufferAllocation,
       riskBufferRelease: acc.riskBufferRelease + record.riskBufferRelease,
       paidRiskBuffer: acc.paidRiskBuffer + record.paidRiskBuffer,
       deductedCredits: acc.deductedCredits + record.deductedCredits,
       forecastIssuance: acc.forecastIssuance + record.forecastIssuance,
       exPostIssuance: acc.exPostIssuance + record.exPostIssuance,
     }), {
       baselineChanges: 0,
       projectStockChanges: 0,
       assumedLeakage: 0,
       riskBufferAllocation: 0,
       riskBufferRelease: 0,
       paidRiskBuffer: 0,
       deductedCredits: 0,
       forecastIssuance: 0,
       exPostIssuance: 0,
     });
   };
 
   const saveTemplate = () => {
     const templateData = {
       projectInfo,
       entities,
       vintageRecords,
       savedAt: new Date().toISOString(),
     };
     localStorage.setItem('carbon-accounting-template', JSON.stringify(templateData));
     toast.success("Template saved locally");
   };
 
   const exportToCSV = () => {
     const totals = calculateTotals();
     
     let csv = "Carbon Accounting Template Export\n\n";
     csv += "PROJECT INFORMATION\n";
     csv += `Project Name,${projectInfo.projectName}\n`;
     csv += `Country,${projectInfo.projectCountry}\n`;
     csv += `Standard Body,${projectInfo.standardBody}\n`;
     csv += `Project Code,${projectInfo.projectCode}\n`;
     csv += `Project Start Date,${projectInfo.projectStartDate}\n`;
     csv += `Crediting Period Start,${projectInfo.creditingPeriodStart}\n`;
     csv += `Crediting Period End,${projectInfo.creditingPeriodEnd}\n`;
     csv += `Commitment Period (years),${projectInfo.commitmentPeriod}\n\n`;
     
     csv += "PROJECT ENTITIES\n";
     csv += "Role,Name,Contact,Address,Telephone,Email,URL\n";
     entities.forEach(e => {
       csv += `${e.role},${e.name},${e.contactInfo},${e.address},${e.telephone},${e.email},${e.urlSource}\n`;
     });
     csv += "\n";
     
     csv += "CARBON ACCOUNTING - VINTAGE RECORDS\n";
     csv += "Crediting Period,Vintage Year,Baseline Changes (tCO2e),Project Stock Changes (tCO2e),Leakage (tCO2e),Risk Buffer Allocation (tCO2e),Risk Buffer Release (tCO2e),Paid Risk Buffer (tCO2e),Deducted Credits (tCO2e),Forecast Issuance (tCO2e),Methodology,Ex Post Issuance (tCO2e)\n";
     vintageRecords.forEach(r => {
       csv += `${r.creditingPeriod},${r.vintageYear},${r.baselineChanges},${r.projectStockChanges},${r.assumedLeakage},${r.riskBufferAllocation},${r.riskBufferRelease},${r.paidRiskBuffer},${r.deductedCredits},${r.forecastIssuance},${r.methodology},${r.exPostIssuance}\n`;
     });
     csv += `TOTALS,,${totals.baselineChanges},${totals.projectStockChanges},${totals.assumedLeakage},${totals.riskBufferAllocation},${totals.riskBufferRelease},${totals.paidRiskBuffer},${totals.deductedCredits},${totals.forecastIssuance},-,${totals.exPostIssuance}\n`;
 
     const blob = new Blob([csv], { type: 'text/csv' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `carbon-accounting-${projectInfo.projectName || 'template'}-${new Date().toISOString().split('T')[0]}.csv`;
     a.click();
     URL.revokeObjectURL(url);
     toast.success("Template exported to CSV");
   };
 
   const totals = calculateTotals();
 
   return (
     <TooltipProvider>
       <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div>
             <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
               <FileSpreadsheet className="h-6 w-6" />
               Carbon Accounting Template
             </h2>
             <p className="text-sm text-gray-600 mt-1">
               Standardized format for carbon project reporting (BeZero CAT)
             </p>
           </div>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={saveTemplate}>
               <Save className="h-4 w-4 mr-2" />
               Save
             </Button>
             <Button variant="outline" size="sm" onClick={exportToCSV}>
               <Download className="h-4 w-4 mr-2" />
               Export CSV
             </Button>
           </div>
         </div>
 
         {/* Section 1: Project Information */}
         <Collapsible open={expandedSections.projectInfo} onOpenChange={() => toggleSection('projectInfo')}>
           <Card className="border border-gray-200">
             <CollapsibleTrigger asChild>
               <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                 <div className="flex items-center justify-between">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <Building2 className="h-5 w-5 text-gray-700" />
                     1. Project Information
                   </CardTitle>
                   {expandedSections.projectInfo ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                 </div>
               </CardHeader>
             </CollapsibleTrigger>
             <CollapsibleContent>
               <CardContent className="pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label className="flex items-center gap-1">
                     Project Name
                     <Tooltip>
                       <TooltipTrigger><Info className="h-3 w-3 text-gray-400" /></TooltipTrigger>
                       <TooltipContent>As registered under the standard body</TooltipContent>
                     </Tooltip>
                   </Label>
                   <Input 
                     value={projectInfo.projectName}
                     onChange={(e) => setProjectInfo({ ...projectInfo, projectName: e.target.value })}
                     placeholder="e.g., Amazon Rainforest Conservation"
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label className="flex items-center gap-1">
                     Project Country
                     <Tooltip>
                       <TooltipTrigger><Info className="h-3 w-3 text-gray-400" /></TooltipTrigger>
                       <TooltipContent>ISO-3 country code format</TooltipContent>
                     </Tooltip>
                   </Label>
                   <Input 
                     value={projectInfo.projectCountry}
                     onChange={(e) => setProjectInfo({ ...projectInfo, projectCountry: e.target.value })}
                     placeholder="e.g., BRA"
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label>Standard Body</Label>
                   <Select 
                     value={projectInfo.standardBody}
                     onValueChange={(value) => setProjectInfo({ ...projectInfo, standardBody: value })}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select standard body" />
                     </SelectTrigger>
                     <SelectContent>
                       {standardBodies.map(body => (
                         <SelectItem key={body} value={body}>{body}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
 
                 <div className="space-y-2">
                   <Label>Project Code</Label>
                   <Input 
                     value={projectInfo.projectCode}
                     onChange={(e) => setProjectInfo({ ...projectInfo, projectCode: e.target.value })}
                     placeholder="e.g., VCS-1234"
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label>Project Start Date</Label>
                   <Input 
                     type="date"
                     value={projectInfo.projectStartDate}
                     onChange={(e) => setProjectInfo({ ...projectInfo, projectStartDate: e.target.value })}
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label>Crediting Period Start</Label>
                   <Input 
                     type="date"
                     value={projectInfo.creditingPeriodStart}
                     onChange={(e) => setProjectInfo({ ...projectInfo, creditingPeriodStart: e.target.value })}
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label>Crediting Period End</Label>
                   <Input 
                     type="date"
                     value={projectInfo.creditingPeriodEnd}
                     onChange={(e) => setProjectInfo({ ...projectInfo, creditingPeriodEnd: e.target.value })}
                   />
                 </div>
 
                 <div className="space-y-2">
                   <Label>Commitment Period (years)</Label>
                   <Select 
                     value={projectInfo.commitmentPeriod}
                     onValueChange={(value) => setProjectInfo({ ...projectInfo, commitmentPeriod: value })}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select period" />
                     </SelectTrigger>
                     <SelectContent>
                       {commitmentPeriods.map(period => (
                         <SelectItem key={period} value={period}>{period}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               </CardContent>
             </CollapsibleContent>
           </Card>
         </Collapsible>
 
         {/* Section 2: Project Entities */}
         <Collapsible open={expandedSections.entities} onOpenChange={() => toggleSection('entities')}>
           <Card className="border border-gray-200">
             <CollapsibleTrigger asChild>
               <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                 <div className="flex items-center justify-between">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <Users className="h-5 w-5 text-gray-700" />
                     2. Project Entities
                     <Badge variant="secondary" className="ml-2">{entities.length}</Badge>
                   </CardTitle>
                   {expandedSections.entities ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                 </div>
               </CardHeader>
             </CollapsibleTrigger>
             <CollapsibleContent>
               <CardContent className="pt-0 space-y-4">
                 {entities.map((entity, index) => (
                   <motion.div 
                     key={entity.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4"
                   >
                     <div className="flex justify-between items-center">
                       <span className="font-medium text-sm text-gray-700">Entity {index + 1}</span>
                       {entities.length > 1 && (
                         <Button variant="ghost" size="sm" onClick={() => removeEntity(entity.id)}>
                           <Trash2 className="h-4 w-4 text-red-500" />
                         </Button>
                       )}
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                       <div className="space-y-1">
                         <Label className="text-xs">Role</Label>
                         <Select 
                           value={entity.role}
                           onValueChange={(value) => updateEntity(entity.id, 'role', value)}
                         >
                           <SelectTrigger className="h-9">
                             <SelectValue placeholder="Select role" />
                           </SelectTrigger>
                           <SelectContent>
                             {entityRoles.map(role => (
                               <SelectItem key={role} value={role}>{role}</SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
 
                       <div className="space-y-1">
                         <Label className="text-xs">Legal Name</Label>
                         <Input 
                           className="h-9"
                           value={entity.name}
                           onChange={(e) => updateEntity(entity.id, 'name', e.target.value)}
                           placeholder="Company name"
                         />
                       </div>
 
                       <div className="space-y-1">
                         <Label className="text-xs">Contact Person</Label>
                         <Input 
                           className="h-9"
                           value={entity.contactInfo}
                           onChange={(e) => updateEntity(entity.id, 'contactInfo', e.target.value)}
                           placeholder="Full name"
                         />
                       </div>
 
                       <div className="space-y-1">
                         <Label className="text-xs">Address</Label>
                         <Input 
                           className="h-9"
                           value={entity.address}
                           onChange={(e) => updateEntity(entity.id, 'address', e.target.value)}
                           placeholder="Full address"
                         />
                       </div>
 
                       <div className="space-y-1">
                         <Label className="text-xs">Telephone</Label>
                         <Input 
                           className="h-9"
                           value={entity.telephone}
                           onChange={(e) => updateEntity(entity.id, 'telephone', e.target.value)}
                           placeholder="+1 234 567 8900"
                         />
                       </div>
 
                       <div className="space-y-1">
                         <Label className="text-xs">Email</Label>
                         <Input 
                           className="h-9"
                           type="email"
                           value={entity.email}
                           onChange={(e) => updateEntity(entity.id, 'email', e.target.value)}
                           placeholder="contact@company.com"
                         />
                       </div>
 
                       <div className="space-y-1 md:col-span-2 lg:col-span-1">
                         <Label className="text-xs">Website URL</Label>
                         <Input 
                           className="h-9"
                           value={entity.urlSource}
                           onChange={(e) => updateEntity(entity.id, 'urlSource', e.target.value)}
                           placeholder="https://company.com"
                         />
                       </div>
                     </div>
                   </motion.div>
                 ))}
 
                 <Button variant="outline" size="sm" onClick={addEntity} className="w-full">
                   <Plus className="h-4 w-4 mr-2" />
                   Add Entity
                 </Button>
               </CardContent>
             </CollapsibleContent>
           </Card>
         </Collapsible>
 
         {/* Section 3: Carbon Accounting */}
         <Collapsible open={expandedSections.carbonAccounting} onOpenChange={() => toggleSection('carbonAccounting')}>
           <Card className="border border-gray-200">
             <CollapsibleTrigger asChild>
               <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                 <div className="flex items-center justify-between">
                   <CardTitle className="flex items-center gap-2 text-lg">
                     <Calendar className="h-5 w-5 text-gray-700" />
                     3. Carbon Accounting
                     <Badge variant="secondary" className="ml-2">{vintageRecords.length} vintages</Badge>
                   </CardTitle>
                   {expandedSections.carbonAccounting ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                 </div>
               </CardHeader>
             </CollapsibleTrigger>
             <CollapsibleContent>
               <CardContent className="pt-0 space-y-4">
                 {vintageRecords.length === 0 ? (
                   <div className="text-center py-8 text-gray-500">
                     <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                     <p>No vintage records yet</p>
                     <p className="text-sm">Add a vintage year to start tracking carbon accounting</p>
                   </div>
                 ) : (
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm border-collapse">
                       <thead>
                         <tr className="bg-gray-100">
                           <th className="p-2 text-left border border-gray-200 font-medium">Period</th>
                           <th className="p-2 text-left border border-gray-200 font-medium">Vintage</th>
                           <th className="p-2 text-right border border-gray-200 font-medium">
                             <Tooltip>
                               <TooltipTrigger className="flex items-center gap-1 justify-end w-full">
                                 Baseline <Info className="h-3 w-3" />
                               </TooltipTrigger>
                               <TooltipContent>Baseline changes in carbon stocks (tCO2e)</TooltipContent>
                             </Tooltip>
                           </th>
                           <th className="p-2 text-right border border-gray-200 font-medium">Project Δ</th>
                           <th className="p-2 text-right border border-gray-200 font-medium">Leakage</th>
                           <th className="p-2 text-right border border-gray-200 font-medium">Risk Buffer</th>
                           <th className="p-2 text-right border border-gray-200 font-medium">Deducted</th>
                           <th className="p-2 text-right border border-gray-200 font-medium bg-emerald-50">Forecast</th>
                           <th className="p-2 text-right border border-gray-200 font-medium bg-blue-50">Ex Post</th>
                           <th className="p-2 text-center border border-gray-200 font-medium">Actions</th>
                         </tr>
                       </thead>
                       <tbody>
                         {vintageRecords.map((record) => (
                           <tr key={record.id} className="hover:bg-gray-50">
                             <td className="p-1 border border-gray-200">
                               <Input 
                                 type="number"
                                 className="h-8 w-16 text-center"
                                 value={record.creditingPeriod}
                                 onChange={(e) => updateVintageRecord(record.id, 'creditingPeriod', parseInt(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200">
                               <Input 
                                 type="number"
                                 className="h-8 w-20 text-center"
                                 value={record.vintageYear}
                                 onChange={(e) => updateVintageRecord(record.id, 'vintageYear', parseInt(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200">
                               <Input 
                                 type="number"
                                 className="h-8 w-24 text-right"
                                 value={record.baselineChanges}
                                 onChange={(e) => updateVintageRecord(record.id, 'baselineChanges', parseFloat(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200">
                               <Input 
                                 type="number"
                                 className="h-8 w-24 text-right"
                                 value={record.projectStockChanges}
                                 onChange={(e) => updateVintageRecord(record.id, 'projectStockChanges', parseFloat(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200">
                               <Input 
                                 type="number"
                                 className="h-8 w-24 text-right"
                                 value={record.assumedLeakage}
                                 onChange={(e) => updateVintageRecord(record.id, 'assumedLeakage', parseFloat(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200">
                               <Input 
                                 type="number"
                                 className="h-8 w-24 text-right"
                                 value={record.riskBufferAllocation}
                                 onChange={(e) => updateVintageRecord(record.id, 'riskBufferAllocation', parseFloat(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200">
                               <Input 
                                 type="number"
                                 className="h-8 w-24 text-right"
                                 value={record.deductedCredits}
                                 onChange={(e) => updateVintageRecord(record.id, 'deductedCredits', parseFloat(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200 bg-emerald-50">
                               <Input 
                                 type="number"
                                 className="h-8 w-24 text-right bg-emerald-50"
                                 value={record.forecastIssuance}
                                 onChange={(e) => updateVintageRecord(record.id, 'forecastIssuance', parseFloat(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200 bg-blue-50">
                               <Input 
                                 type="number"
                                 className="h-8 w-24 text-right bg-blue-50"
                                 value={record.exPostIssuance}
                                 onChange={(e) => updateVintageRecord(record.id, 'exPostIssuance', parseFloat(e.target.value) || 0)}
                               />
                             </td>
                             <td className="p-1 border border-gray-200 text-center">
                               <Button variant="ghost" size="sm" onClick={() => removeVintageRecord(record.id)}>
                                 <Trash2 className="h-4 w-4 text-red-500" />
                               </Button>
                             </td>
                           </tr>
                         ))}
                         {/* Totals Row */}
                         <tr className="bg-gray-100 font-medium">
                           <td className="p-2 border border-gray-200" colSpan={2}>TOTAL</td>
                           <td className="p-2 border border-gray-200 text-right">{totals.baselineChanges.toLocaleString()}</td>
                           <td className="p-2 border border-gray-200 text-right">{totals.projectStockChanges.toLocaleString()}</td>
                           <td className="p-2 border border-gray-200 text-right">{totals.assumedLeakage.toLocaleString()}</td>
                           <td className="p-2 border border-gray-200 text-right">{totals.riskBufferAllocation.toLocaleString()}</td>
                           <td className="p-2 border border-gray-200 text-right">{totals.deductedCredits.toLocaleString()}</td>
                           <td className="p-2 border border-gray-200 text-right bg-emerald-100">{totals.forecastIssuance.toLocaleString()}</td>
                           <td className="p-2 border border-gray-200 text-right bg-blue-100">{totals.exPostIssuance.toLocaleString()}</td>
                           <td className="p-2 border border-gray-200"></td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                 )}
 
                 <Button variant="outline" size="sm" onClick={addVintageRecord} className="w-full">
                   <Plus className="h-4 w-4 mr-2" />
                   Add Vintage Year
                 </Button>
               </CardContent>
             </CollapsibleContent>
           </Card>
         </Collapsible>
 
         {/* Summary Stats */}
         {vintageRecords.length > 0 && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="grid grid-cols-2 md:grid-cols-4 gap-4"
           >
             <Card className="border border-gray-200">
               <CardContent className="p-4 text-center">
                 <div className="text-2xl font-semibold text-emerald-600">
                   {totals.forecastIssuance.toLocaleString()}
                 </div>
                 <div className="text-xs text-gray-500">Forecast Issuance (tCO2e)</div>
               </CardContent>
             </Card>
             <Card className="border border-gray-200">
               <CardContent className="p-4 text-center">
                 <div className="text-2xl font-semibold text-blue-600">
                   {totals.exPostIssuance.toLocaleString()}
                 </div>
                 <div className="text-xs text-gray-500">Ex Post Issuance (tCO2e)</div>
               </CardContent>
             </Card>
             <Card className="border border-gray-200">
               <CardContent className="p-4 text-center">
                 <div className="text-2xl font-semibold text-gray-700">
                   {totals.riskBufferAllocation.toLocaleString()}
                 </div>
                 <div className="text-xs text-gray-500">Risk Buffer (tCO2e)</div>
               </CardContent>
             </Card>
             <Card className="border border-gray-200">
               <CardContent className="p-4 text-center">
                 <div className="text-2xl font-semibold text-orange-600">
                   {totals.assumedLeakage.toLocaleString()}
                 </div>
                 <div className="text-xs text-gray-500">Leakage (tCO2e)</div>
               </CardContent>
             </Card>
           </motion.div>
         )}
       </div>
     </TooltipProvider>
   );
 };