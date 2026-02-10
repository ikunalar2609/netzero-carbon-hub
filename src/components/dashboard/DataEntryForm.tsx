import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClimate } from '@/context/ClimateContext';
import { toast } from 'sonner';
import { Plus, Save, RefreshCw, Loader2 } from 'lucide-react';

export const DataEntryForm = () => {
  const { addEmissionData, addMilestoneData, addOffsetData, refreshData, loading } = useClimate();
  const [activeTab, setActiveTab] = useState('emissions');
  const [isSaving, setIsSaving] = useState(false);

  // Emissions form state
  const [emissionForm, setEmissionForm] = useState({
    year: new Date().getFullYear(),
    scope1: 0,
    scope2: 0,
    scope3: 0,
  });

  // Milestone form state
  const [milestoneForm, setMilestoneForm] = useState({
    year: new Date().getFullYear() + 1,
    event: '',
    status: 'planned' as 'completed' | 'inProgress' | 'planned',
    reductionTarget: 0,
    offsetDependency: 0,
  });

  // Offset form state
  const [offsetForm, setOffsetForm] = useState({
    projectName: '',
    category: 'Forestry',
    credits: 0,
    pricePerTon: 0,
    qualityScore: 80,
    vintage: new Date().getFullYear().toString(),
  });

  const handleAddEmission = async () => {
    if (emissionForm.year < 2000 || emissionForm.year > 2100) {
      toast.error('Please enter a valid year between 2000 and 2100');
      return;
    }
    setIsSaving(true);
    try {
      await addEmissionData({
        year: emissionForm.year,
        scope1: emissionForm.scope1,
        scope2: emissionForm.scope2,
        scope3: emissionForm.scope3,
      });
      setEmissionForm({ year: emissionForm.year + 1, scope1: 0, scope2: 0, scope3: 0 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!milestoneForm.event.trim()) {
      toast.error('Please enter a milestone event name');
      return;
    }
    setIsSaving(true);
    try {
      await addMilestoneData({
        year: milestoneForm.year,
        event: milestoneForm.event,
        status: milestoneForm.status,
        reductionTarget: milestoneForm.reductionTarget,
        offsetDependency: milestoneForm.offsetDependency,
        standards: [],
      });
      setMilestoneForm({ year: milestoneForm.year + 1, event: '', status: 'planned', reductionTarget: 0, offsetDependency: 0 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOffset = async () => {
    if (!offsetForm.projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    setIsSaving(true);
    try {
      await addOffsetData({
        projectName: offsetForm.projectName,
        category: offsetForm.category,
        credits: offsetForm.credits,
        pricePerTon: offsetForm.pricePerTon,
        qualityScore: offsetForm.qualityScore,
        vintage: offsetForm.vintage,
        selected: false,
      });
      setOffsetForm({ projectName: '', category: 'Forestry', credits: 0, pricePerTon: 0, qualityScore: 80, vintage: new Date().getFullYear().toString() });
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = "bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-600 focus:border-emerald-500/50";
  const labelClasses = "text-gray-400";

  return (
    <Card className="shadow-lg bg-[#141414] border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white">Add Climate Data</CardTitle>
        <Button variant="outline" size="sm" onClick={refreshData} disabled={loading} className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger value="emissions" className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white">Emissions</TabsTrigger>
            <TabsTrigger value="milestones" className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white">Milestones</TabsTrigger>
            <TabsTrigger value="offsets" className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white">Carbon Offsets</TabsTrigger>
          </TabsList>

          <TabsContent value="emissions" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="em-year" className={labelClasses}>Year</Label>
                <Input id="em-year" type="number" value={emissionForm.year} onChange={(e) => setEmissionForm(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))} min={2000} max={2100} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope1" className={labelClasses}>Scope 1 (tCO₂e)</Label>
                <Input id="scope1" type="number" value={emissionForm.scope1} onChange={(e) => setEmissionForm(prev => ({ ...prev, scope1: parseFloat(e.target.value) || 0 }))} min={0} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope2" className={labelClasses}>Scope 2 (tCO₂e)</Label>
                <Input id="scope2" type="number" value={emissionForm.scope2} onChange={(e) => setEmissionForm(prev => ({ ...prev, scope2: parseFloat(e.target.value) || 0 }))} min={0} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope3" className={labelClasses}>Scope 3 (tCO₂e)</Label>
                <Input id="scope3" type="number" value={emissionForm.scope3} onChange={(e) => setEmissionForm(prev => ({ ...prev, scope3: parseFloat(e.target.value) || 0 }))} min={0} className={inputClasses} />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div className="text-sm text-gray-500">
                Total: <span className="font-semibold text-gray-200">
                  {(emissionForm.scope1 + emissionForm.scope2 + emissionForm.scope3).toLocaleString()} tCO₂e
                </span>
              </div>
              <Button onClick={handleAddEmission} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Emission Data
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ms-year" className={labelClasses}>Target Year</Label>
                <Input id="ms-year" type="number" value={milestoneForm.year} onChange={(e) => setMilestoneForm(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))} min={2020} max={2100} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ms-event" className={labelClasses}>Milestone Event</Label>
                <Input id="ms-event" placeholder="e.g., 50% Emissions Reduction" value={milestoneForm.event} onChange={(e) => setMilestoneForm(prev => ({ ...prev, event: e.target.value }))} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ms-status" className={labelClasses}>Status</Label>
                <Select value={milestoneForm.status} onValueChange={(value: 'completed' | 'inProgress' | 'planned') => setMilestoneForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-gray-200">
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ms-target" className={labelClasses}>Reduction Target (%)</Label>
                <Input id="ms-target" type="number" value={milestoneForm.reductionTarget} onChange={(e) => setMilestoneForm(prev => ({ ...prev, reductionTarget: parseFloat(e.target.value) || 0 }))} min={0} max={100} className={inputClasses} />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-white/5">
              <Button onClick={handleAddMilestone} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Milestone
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="offsets" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="of-name" className={labelClasses}>Project Name</Label>
                <Input id="of-name" placeholder="e.g., Amazon Reforestation" value={offsetForm.projectName} onChange={(e) => setOffsetForm(prev => ({ ...prev, projectName: e.target.value }))} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="of-category" className={labelClasses}>Category</Label>
                <Select value={offsetForm.category} onValueChange={(value) => setOffsetForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-gray-200">
                    <SelectItem value="Forestry">Forestry</SelectItem>
                    <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                    <SelectItem value="Methane Reduction">Methane Reduction</SelectItem>
                    <SelectItem value="Energy Efficiency">Energy Efficiency</SelectItem>
                    <SelectItem value="Carbon Capture">Carbon Capture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="of-credits" className={labelClasses}>Credits (tCO₂e)</Label>
                <Input id="of-credits" type="number" value={offsetForm.credits} onChange={(e) => setOffsetForm(prev => ({ ...prev, credits: parseFloat(e.target.value) || 0 }))} min={0} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="of-price" className={labelClasses}>Price per Ton ($)</Label>
                <Input id="of-price" type="number" step="0.01" value={offsetForm.pricePerTon} onChange={(e) => setOffsetForm(prev => ({ ...prev, pricePerTon: parseFloat(e.target.value) || 0 }))} min={0} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="of-quality" className={labelClasses}>Quality Score (0-100)</Label>
                <Input id="of-quality" type="number" value={offsetForm.qualityScore} onChange={(e) => setOffsetForm(prev => ({ ...prev, qualityScore: parseFloat(e.target.value) || 0 }))} min={0} max={100} className={inputClasses} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="of-vintage" className={labelClasses}>Vintage Year</Label>
                <Input id="of-vintage" value={offsetForm.vintage} onChange={(e) => setOffsetForm(prev => ({ ...prev, vintage: e.target.value }))} className={inputClasses} />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-white/5">
              <Button onClick={handleAddOffset} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Carbon Offset
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataEntryForm;
