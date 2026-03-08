import { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heart, ChevronDown, ChevronUp, ExternalLink, Calculator } from "lucide-react";
import { type EmissionFactor } from "@/data/emissionFactors";

interface BenchmarkTableProps {
  factors: EmissionFactor[];
  onToggleFavorite: (id: string) => void;
  onUseInCalculator?: (factor: EmissionFactor) => void;
}

export const BenchmarkTable = ({ factors, onToggleFavorite, onUseInCalculator }: BenchmarkTableProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === factors.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(factors.map(f => f.id)));
    }
  };

  const sorted = [...factors].sort((a, b) => {
    let va: any = a[sortField as keyof EmissionFactor];
    let vb: any = b[sortField as keyof EmissionFactor];
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline ml-0.5" /> : <ChevronDown className="h-3 w-3 inline ml-0.5" />;
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      CBAM: "bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20",
      sustainalize: "bg-emerald-50 text-emerald-700 border-emerald-200",
      DEFRA: "bg-amber-50 text-amber-700 border-amber-200",
      IPCC: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return colors[source] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
            <TableHead className="w-10">
              <Checkbox
                checked={selectedRows.size === factors.length && factors.length > 0}
                onCheckedChange={toggleAll}
                className="h-3.5 w-3.5 rounded border-gray-300 data-[state=checked]:bg-[#4F46E5] data-[state=checked]:border-[#4F46E5]"
              />
            </TableHead>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-10"></TableHead>
            <TableHead
              className="font-semibold text-[11px] tracking-wide text-gray-600 cursor-pointer hover:text-gray-900 select-none"
              onClick={() => handleSort("name")}
            >
              Name <SortIcon field="name" />
            </TableHead>
            <TableHead
              className="font-semibold text-[11px] tracking-wide text-gray-600 cursor-pointer hover:text-gray-900 select-none"
              onClick={() => handleSort("fe")}
            >
              FE <SortIcon field="fe" />
            </TableHead>
            <TableHead className="font-semibold text-[11px] tracking-wide text-gray-600">Unit</TableHead>
            <TableHead className="font-semibold text-[11px] tracking-wide text-gray-600">Perimeter</TableHead>
            <TableHead
              className="font-semibold text-[11px] tracking-wide text-gray-600 cursor-pointer hover:text-gray-900 select-none"
              onClick={() => handleSort("source")}
            >
              Source <SortIcon field="source" />
            </TableHead>
            {onUseInCalculator && (
              <TableHead className="font-semibold text-[11px] tracking-wide text-gray-600 w-[60px]">Use</TableHead>
            )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((factor, index) => (
            <motion.tr
              key={factor.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.015 }}
              className="border-b border-gray-100 hover:bg-[#4F46E5]/[0.02] transition-colors cursor-pointer group"
            >
              <TableCell className="py-3">
                <Checkbox
                  checked={selectedRows.has(factor.id)}
                  onCheckedChange={() => toggleRow(factor.id)}
                  className="h-3.5 w-3.5 rounded border-gray-300 data-[state=checked]:bg-[#4F46E5] data-[state=checked]:border-[#4F46E5]"
                />
              </TableCell>
              <TableCell className="py-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === factor.id ? null : factor.id); }}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {expandedRow === factor.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </TableCell>
              <TableCell className="py-3">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(factor.id); }}
                  className={`transition-colors ${factor.isFavorite ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
                >
                  <Heart className={`h-3.5 w-3.5 ${factor.isFavorite ? "fill-current" : ""}`} />
                </button>
              </TableCell>
              <TableCell className="py-3">
                <div>
                  <span className="text-[12px] font-medium text-gray-800 group-hover:text-[#4F46E5] transition-colors">
                    <span className="font-semibold text-[#4F46E5]">{factor.name.split(" ")[0]}</span>{" "}
                    {factor.name.split(" ").slice(1).join(" ")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <span className="text-[12px] font-semibold text-[#4F46E5]">
                  {factor.fe} kgCO₂eq
                </span>
              </TableCell>
              <TableCell className="py-3">
                <span className="text-[11px] text-gray-500">{factor.unit}</span>
              </TableCell>
              <TableCell className="py-3">
                <span className="text-[11px] text-gray-500 leading-tight block max-w-[160px]">
                  {factor.perimeter}
                </span>
              </TableCell>
              <TableCell className="py-3">
                <Badge variant="outline" className={`text-[10px] font-medium border ${getSourceBadge(factor.source)}`}>
                  {factor.source}
                </Badge>
              </TableCell>
            </motion.tr>
          ))}
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                No emission factors match your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Expanded row detail */}
      {expandedRow && (() => {
        const factor = factors.find(f => f.id === expandedRow);
        if (!factor) return null;
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 bg-gray-50/50 px-6 py-4"
          >
            <div className="space-y-3">
              <div>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-[12px] text-gray-700 leading-relaxed">{factor.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sector</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{factor.sector}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub-Sector</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{factor.subSector}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data Type</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{factor.dataType}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{factor.lastUpdated}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Methodology</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{factor.methodology}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scope</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{factor.scope.replace("scope", "Scope ")}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Region</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{factor.region}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</span>
                  <p className="text-[12px] text-gray-700 mt-0.5">{factor.category}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
};
