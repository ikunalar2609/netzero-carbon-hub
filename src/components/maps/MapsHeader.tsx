import React from "react";
import { ArrowLeft, Globe, RefreshCw, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TIME_OPTIONS, SATELLITE_OPTIONS, REGION_OPTIONS } from "./constants";
import farmlyLogo from "@/assets/farmly-carbon-logo.png";

interface MapsHeaderProps {
  days: string;
  setDays: (v: string) => void;
  satelliteSource: string;
  setSatelliteSource: (v: string) => void;
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  isLoading: boolean;
  onNavClick?: (item: string) => void;
}

const SelectFilter = React.memo(({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <select
    className="h-8 px-2.5 text-[10px] font-bold bg-white/15 border border-white/20 rounded-md text-white appearance-none cursor-pointer hover:bg-white/25 transition-colors"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value} className="text-gray-900 bg-white">{o.label}</option>
    ))}
  </select>
));
SelectFilter.displayName = "SelectFilter";

const MapsHeader = React.memo(({
  days, setDays, satelliteSource, setSatelliteSource, selectedRegion, setSelectedRegion, isLoading, onNavClick,
}: MapsHeaderProps) => {
  const navigate = useNavigate();

  const navItems = ["MAPS", "CHARTS", "CLIMATE DATA", "DOCS"];

  return (
    <header className="bg-[#4F46E5] sticky top-0 z-50">
      {/* Top nav row */}
      <div className="max-w-[1600px] mx-auto px-5 h-[56px] flex items-center">
        {/* Logo + Title */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
          className="flex items-center gap-2.5 mr-5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img src={farmlyLogo} alt="FarmlyCarbon" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-[16px] font-bold tracking-tight text-white">Environmental Maps & Charts</span>
        </a>

        <span className="text-[9px] font-bold tracking-widest px-2 py-[3px] rounded-full bg-white/20 text-white/90 leading-none mr-4">
          LIVE
        </span>

        {/* Nav items */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {navItems.map((item) => (
            <button
              key={item}
              className={`px-3 py-1.5 text-[11px] font-semibold tracking-wide rounded-md transition-all ${
                item === "MAPS"
                  ? "text-white bg-white/20"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {isLoading && (
          <span className="flex items-center gap-1 text-[10px] text-white/50 ml-3">
            <RefreshCw className="h-3 w-3 animate-spin" /> Syncing…
          </span>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-2 ml-auto">
          <SelectFilter value={days} onChange={setDays} options={TIME_OPTIONS} />
          <SelectFilter value={satelliteSource} onChange={setSatelliteSource} options={SATELLITE_OPTIONS} />
          <SelectFilter value={selectedRegion} onChange={setSelectedRegion} options={REGION_OPTIONS} />

          <div className="h-5 w-px bg-white/20 mx-1" />

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            HOME
          </button>
        </div>
      </div>
    </header>
  );
});
MapsHeader.displayName = "MapsHeader";

export default MapsHeader;
