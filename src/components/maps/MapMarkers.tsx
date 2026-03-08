import React from "react";
import { ForestData, getForestIntensity, formatHectares } from "@/utils/parseForestData";
import type { FireData, TreeLossFromDB } from "./constants";

export const FireMarker = React.memo(({ fire }: { fire: FireData }) => {
  const color = fire.frp > 50 ? "bg-red-500" : fire.frp > 20 ? "bg-yellow-400" : "bg-green-400";
  return (
    <div className="relative group">
      <div className={`w-2.5 h-2.5 rounded-full border border-white/30 ${color}`} />
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-md whitespace-nowrap z-[9999] shadow-xl border border-white/20">
        <div className="font-medium">{fire.satellite}</div>
        <div>{fire.acq_date} • FRP {fire.frp.toFixed(1)} MW</div>
      </div>
    </div>
  );
});
FireMarker.displayName = "FireMarker";

export const ForestMarker = React.memo(({ forest }: { forest: ForestData }) => {
  const intensity = getForestIntensity(forest.gfc_extent_ha);
  const color = intensity === "high" ? "bg-green-700" : intensity === "medium" ? "bg-green-500" : "bg-green-300";
  return (
    <div className="relative group">
      <div className={`w-2.5 h-2.5 rounded-full border border-white/20 ${color}`} />
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white text-gray-800 text-[10px] px-2 py-1 rounded shadow whitespace-nowrap z-50">
        <div className="font-medium">{forest.country}</div>
        <div>{formatHectares(forest.gfc_extent_ha)}</div>
      </div>
    </div>
  );
});
ForestMarker.displayName = "ForestMarker";

export const TreeLossMarker = React.memo(({ data }: { data: TreeLossFromDB }) => {
  const intensity = data.loss_percentage > 20 ? "critical" : data.loss_percentage > 15 ? "high" : "moderate";
  const colorMap = { critical: "bg-red-600", high: "bg-orange-500", moderate: "bg-yellow-500" };
  const sizeMap = { critical: "w-3.5 h-3.5", high: "w-3 h-3", moderate: "w-2.5 h-2.5" };

  return (
    <div className="relative group">
      {intensity === "critical" && (
        <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-40" style={{ width: 18, height: 18, marginLeft: -2, marginTop: -2 }} />
      )}
      <div
        className={`${sizeMap[intensity]} rounded-full border-2 border-white/80 ${colorMap[intensity]} shadow-lg`}
        style={{ boxShadow: intensity === "critical" ? "0 0 12px rgba(239, 68, 68, 0.6)" : "0 0 8px rgba(0,0,0,0.3)" }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50 border border-gray-700">
        <div className="font-semibold text-orange-400 mb-0.5">{data.region}</div>
        <div className="text-gray-300">Loss: <span className="text-white font-medium">{data.loss_percentage}%</span></div>
        <div className="text-gray-300">Period: <span className="text-white">{data.loss_year}</span></div>
        <div className="text-gray-300">Cause: <span className="text-yellow-400">{data.cause}</span></div>
      </div>
    </div>
  );
});
TreeLossMarker.displayName = "TreeLossMarker";
