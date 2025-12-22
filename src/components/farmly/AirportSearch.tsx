import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Plane, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

interface AirportSearchProps {
  value: string;
  onChange: (iata: string) => void;
  placeholder?: string;
  label?: string;
}

export const AirportSearch = ({ value, onChange, placeholder = "Search airport...", label }: AirportSearchProps) => {
  const [query, setQuery] = useState(value);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch airports on mount
  useEffect(() => {
    const fetchAirports = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('flight-emissions', {
          body: { listAirports: true }
        });
        
        if (!error && data?.airports) {
          setAirports(data.airports);
        }
      } catch (err) {
        console.error('Failed to fetch airports:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAirports();
  }, []);

  // Find selected airport when value changes externally
  useEffect(() => {
    if (value && airports.length > 0) {
      const found = airports.find(a => a.iata === value);
      if (found) {
        setSelectedAirport(found);
        setQuery(`${found.city} (${found.iata})`);
      }
    } else if (!value) {
      setSelectedAirport(null);
      setQuery('');
    }
  }, [value, airports]);

  // Filter airports based on query
  const filteredAirports = useMemo(() => {
    if (!query || selectedAirport) return [];
    
    const searchTerm = query.toLowerCase().trim();
    if (searchTerm.length < 1) return [];
    
    return airports
      .filter(airport => 
        airport.city.toLowerCase().includes(searchTerm) ||
        airport.iata.toLowerCase().includes(searchTerm) ||
        airport.name.toLowerCase().includes(searchTerm) ||
        airport.country.toLowerCase().includes(searchTerm)
      )
      .slice(0, 8);
  }, [query, airports, selectedAirport]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setSelectedAirport(null);
    setShowDropdown(true);
    
    // If user clears input, also clear the parent value
    if (!newValue) {
      onChange('');
    }
  };

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    setQuery(`${airport.city} (${airport.iata})`);
    onChange(airport.iata);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    if (!selectedAirport && query.length >= 1) {
      setShowDropdown(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedAirport(null);
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pl-9 pr-8 rounded-xl border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B5CF6] animate-spin" />
        )}
        {selectedAirport && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569] hover:text-[#1E293B] transition-colors"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Dropdown */}
      {showDropdown && filteredAirports.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-64 overflow-y-auto"
        >
          {filteredAirports.map((airport) => (
            <button
              key={airport.iata}
              type="button"
              onClick={() => handleSelect(airport)}
              className={cn(
                "w-full px-3 py-2.5 flex items-start gap-3 hover:bg-[#F0F4FF] transition-colors text-left",
                "first:rounded-t-xl last:rounded-b-xl"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                  <Plane className="h-4 w-4 text-[#8B5CF6]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1E293B]">{airport.iata}</span>
                  <span className="text-sm text-[#475569] truncate">{airport.city}</span>
                </div>
                <div className="text-xs text-[#64748B] truncate">
                  {airport.name} • {airport.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {showDropdown && query.length >= 1 && !selectedAirport && filteredAirports.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-2 text-[#475569]">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">No airports found for "{query}"</span>
          </div>
        </div>
      )}
    </div>
  );
};
