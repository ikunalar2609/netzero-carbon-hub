import React from "react";
import { ArrowLeft, Globe, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TIME_OPTIONS, SATELLITE_OPTIONS, REGION_OPTIONS } from "./constants";

interface MapsHeaderProps {
  days: string;
  setDays: (v: string) => void;
  satelliteSource: string;
  setSatelliteSource: (v: string) => void;
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  isLoading: boolean;
}

const SelectFilter = React.memo(({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <select
    className="h-7 px-2 text-[10px] font-bold bg-gray-100 border border-gray-200 rounded-md text-gray-700"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>
    ))}
  </select>
));
SelectFilter.displayName = "SelectFilter";

const MapsHeader = React.memo(({
  days, setDays, satelliteSource, setSatelliteSource, selectedRegion, setSelectedRegion, isLoading,
}: MapsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-5 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-[11px] font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            HOME
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-600" />
            <span className="text-[14px] font-extrabold text-gray-900 tracking-tight">Environmental Maps</span>
          </div>
          {isLoading && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 ml-3">
              <RefreshCw className="h-3 w-3 animate-spin" /> Syncing…
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SelectFilter value={days} onChange={setDays} options={TIME_OPTIONS} />
          <SelectFilter value={satelliteSource} onChange={setSatelliteSource} options={SATELLITE_OPTIONS} />
          <SelectFilter value={selectedRegion} onChange={setSelectedRegion} options={REGION_OPTIONS} />
        </div>
      </div>
    </header>
  );
});
MapsHeader.displayName = "MapsHeader";

export default MapsHeader;
