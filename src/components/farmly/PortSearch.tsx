import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Anchor, Loader2, Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Port {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

// Major global ports database
const PORTS_DATABASE: Port[] = [
  // Asia
  { code: "SGSIN", name: "Port of Singapore", city: "Singapore", country: "Singapore", lat: 1.2644, lon: 103.8198 },
  { code: "CNSHA", name: "Port of Shanghai", city: "Shanghai", country: "China", lat: 31.2304, lon: 121.4737 },
  { code: "CNNGB", name: "Ningbo-Zhoushan Port", city: "Ningbo", country: "China", lat: 29.8683, lon: 121.5440 },
  { code: "CNSHE", name: "Port of Shenzhen", city: "Shenzhen", country: "China", lat: 22.5431, lon: 114.0579 },
  { code: "CNQIN", name: "Port of Qingdao", city: "Qingdao", country: "China", lat: 36.0671, lon: 120.3826 },
  { code: "CNTIA", name: "Port of Tianjin", city: "Tianjin", country: "China", lat: 38.9860, lon: 117.7115 },
  { code: "CNXIA", name: "Port of Xiamen", city: "Xiamen", country: "China", lat: 24.4798, lon: 118.0894 },
  { code: "HKHKG", name: "Port of Hong Kong", city: "Hong Kong", country: "Hong Kong", lat: 22.3193, lon: 114.1694 },
  { code: "KRPUS", name: "Port of Busan", city: "Busan", country: "South Korea", lat: 35.1796, lon: 129.0756 },
  { code: "JPYOK", name: "Port of Yokohama", city: "Yokohama", country: "Japan", lat: 35.4437, lon: 139.6380 },
  { code: "JPTYO", name: "Port of Tokyo", city: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { code: "JPKOB", name: "Port of Kobe", city: "Kobe", country: "Japan", lat: 34.6901, lon: 135.1956 },
  { code: "TWKHH", name: "Port of Kaohsiung", city: "Kaohsiung", country: "Taiwan", lat: 22.6273, lon: 120.3014 },
  { code: "MYKLG", name: "Port Klang", city: "Klang", country: "Malaysia", lat: 3.0319, lon: 101.3673 },
  { code: "MYTPP", name: "Port of Tanjung Pelepas", city: "Johor Bahru", country: "Malaysia", lat: 1.3631, lon: 103.5505 },
  { code: "THBKK", name: "Port of Bangkok", city: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  { code: "THLCH", name: "Port of Laem Chabang", city: "Laem Chabang", country: "Thailand", lat: 13.0830, lon: 100.8833 },
  { code: "VNSGN", name: "Port of Ho Chi Minh", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.7769, lon: 106.7009 },
  { code: "INMAA", name: "Port of Chennai", city: "Chennai", country: "India", lat: 13.0827, lon: 80.2707 },
  { code: "INMUN", name: "Port of Mumbai (JNPT)", city: "Mumbai", country: "India", lat: 18.9489, lon: 72.9488 },
  { code: "INCCU", name: "Port of Kolkata", city: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639 },
  { code: "LKCMB", name: "Port of Colombo", city: "Colombo", country: "Sri Lanka", lat: 6.9271, lon: 79.8612 },
  { code: "PKKHI", name: "Port of Karachi", city: "Karachi", country: "Pakistan", lat: 24.8607, lon: 67.0011 },
  { code: "IDSUB", name: "Port of Surabaya", city: "Surabaya", country: "Indonesia", lat: -7.2575, lon: 112.7521 },
  { code: "IDJKT", name: "Port of Jakarta", city: "Jakarta", country: "Indonesia", lat: -6.1751, lon: 106.8650 },
  { code: "PHMNL", name: "Port of Manila", city: "Manila", country: "Philippines", lat: 14.5995, lon: 120.9842 },
  
  // Middle East
  { code: "AEJEA", name: "Port of Jebel Ali", city: "Dubai", country: "UAE", lat: 25.0183, lon: 55.0610 },
  { code: "AEDXB", name: "Port Rashid Dubai", city: "Dubai", country: "UAE", lat: 25.2697, lon: 55.2963 },
  { code: "AEAUH", name: "Port of Abu Dhabi", city: "Abu Dhabi", country: "UAE", lat: 24.4539, lon: 54.3773 },
  { code: "OMSLL", name: "Port of Salalah", city: "Salalah", country: "Oman", lat: 16.9498, lon: 54.0048 },
  { code: "SAJED", name: "Port of Jeddah", city: "Jeddah", country: "Saudi Arabia", lat: 21.4858, lon: 39.1925 },
  { code: "IQBSR", name: "Port of Basra", city: "Basra", country: "Iraq", lat: 30.5089, lon: 47.7837 },
  { code: "KWKWI", name: "Port of Kuwait", city: "Kuwait City", country: "Kuwait", lat: 29.3759, lon: 47.9774 },
  { code: "QADOH", name: "Port of Doha", city: "Doha", country: "Qatar", lat: 25.2854, lon: 51.5310 },
  { code: "BHBAH", name: "Port of Bahrain", city: "Manama", country: "Bahrain", lat: 26.2285, lon: 50.5860 },
  { code: "IRBND", name: "Port of Bandar Abbas", city: "Bandar Abbas", country: "Iran", lat: 27.1832, lon: 56.2666 },
  { code: "EGPSD", name: "Port Said", city: "Port Said", country: "Egypt", lat: 31.2653, lon: 32.3019 },
  { code: "EGALY", name: "Port of Alexandria", city: "Alexandria", country: "Egypt", lat: 31.2001, lon: 29.9187 },
  
  // Europe
  { code: "NLRTM", name: "Port of Rotterdam", city: "Rotterdam", country: "Netherlands", lat: 51.9225, lon: 4.4792 },
  { code: "BEANR", name: "Port of Antwerp", city: "Antwerp", country: "Belgium", lat: 51.2194, lon: 4.4025 },
  { code: "DEHAM", name: "Port of Hamburg", city: "Hamburg", country: "Germany", lat: 53.5511, lon: 9.9937 },
  { code: "DEBRV", name: "Port of Bremerhaven", city: "Bremerhaven", country: "Germany", lat: 53.5396, lon: 8.5809 },
  { code: "FRLEH", name: "Port of Le Havre", city: "Le Havre", country: "France", lat: 49.4944, lon: 0.1079 },
  { code: "FRMAR", name: "Port of Marseille", city: "Marseille", country: "France", lat: 43.2965, lon: 5.3698 },
  { code: "ESBCN", name: "Port of Barcelona", city: "Barcelona", country: "Spain", lat: 41.3851, lon: 2.1734 },
  { code: "ESVAL", name: "Port of Valencia", city: "Valencia", country: "Spain", lat: 39.4699, lon: -0.3763 },
  { code: "ESALG", name: "Port of Algeciras", city: "Algeciras", country: "Spain", lat: 36.1408, lon: -5.4556 },
  { code: "ITGOA", name: "Port of Genoa", city: "Genoa", country: "Italy", lat: 44.4056, lon: 8.9463 },
  { code: "ITLSP", name: "Port of La Spezia", city: "La Spezia", country: "Italy", lat: 44.1024, lon: 9.8248 },
  { code: "ITGIT", name: "Port of Gioia Tauro", city: "Gioia Tauro", country: "Italy", lat: 38.4389, lon: 15.9014 },
  { code: "GRPIR", name: "Port of Piraeus", city: "Athens", country: "Greece", lat: 37.9427, lon: 23.6477 },
  { code: "GBFXT", name: "Port of Felixstowe", city: "Felixstowe", country: "UK", lat: 51.9543, lon: 1.3511 },
  { code: "GBSOU", name: "Port of Southampton", city: "Southampton", country: "UK", lat: 50.9097, lon: -1.4044 },
  { code: "GBLGP", name: "Port of London Gateway", city: "London", country: "UK", lat: 51.4978, lon: 0.4657 },
  { code: "PTLIS", name: "Port of Lisbon", city: "Lisbon", country: "Portugal", lat: 38.7223, lon: -9.1393 },
  { code: "PTSIE", name: "Port of Sines", city: "Sines", country: "Portugal", lat: 37.9560, lon: -8.8670 },
  { code: "RULED", name: "Port of St. Petersburg", city: "St. Petersburg", country: "Russia", lat: 59.9311, lon: 30.3609 },
  { code: "RUGDX", name: "Port of Novorossiysk", city: "Novorossiysk", country: "Russia", lat: 44.7235, lon: 37.7687 },
  { code: "TRIST", name: "Port of Istanbul", city: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784 },
  { code: "TRMER", name: "Port of Mersin", city: "Mersin", country: "Turkey", lat: 36.8000, lon: 34.6333 },
  { code: "PLGDY", name: "Port of Gdynia", city: "Gdynia", country: "Poland", lat: 54.5189, lon: 18.5305 },
  { code: "PLGDN", name: "Port of Gdansk", city: "Gdansk", country: "Poland", lat: 54.3520, lon: 18.6466 },
  { code: "SEGOT", name: "Port of Gothenburg", city: "Gothenburg", country: "Sweden", lat: 57.7089, lon: 11.9746 },
  { code: "NOOSL", name: "Port of Oslo", city: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522 },
  { code: "DKCPH", name: "Port of Copenhagen", city: "Copenhagen", country: "Denmark", lat: 55.6761, lon: 12.5683 },
  { code: "FIHEL", name: "Port of Helsinki", city: "Helsinki", country: "Finland", lat: 60.1699, lon: 24.9384 },
  
  // Africa
  { code: "MATNG", name: "Port of Tanger Med", city: "Tangier", country: "Morocco", lat: 35.8889, lon: -5.5006 },
  { code: "ZADUR", name: "Port of Durban", city: "Durban", country: "South Africa", lat: -29.8587, lon: 31.0218 },
  { code: "ZACPT", name: "Port of Cape Town", city: "Cape Town", country: "South Africa", lat: -33.9249, lon: 18.4241 },
  { code: "MAPTM", name: "Port of Mombasa", city: "Mombasa", country: "Kenya", lat: -4.0435, lon: 39.6682 },
  { code: "TZDAR", name: "Port of Dar es Salaam", city: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lon: 39.2083 },
  { code: "NGLAG", name: "Port of Lagos (Apapa)", city: "Lagos", country: "Nigeria", lat: 6.4550, lon: 3.3841 },
  { code: "DZALG", name: "Port of Algiers", city: "Algiers", country: "Algeria", lat: 36.7538, lon: 3.0588 },
  { code: "MUPRM", name: "Port Louis", city: "Port Louis", country: "Mauritius", lat: -20.1609, lon: 57.5012 },
  
  // Americas - North
  { code: "USLAX", name: "Port of Los Angeles", city: "Los Angeles", country: "USA", lat: 33.7405, lon: -118.2720 },
  { code: "USLGB", name: "Port of Long Beach", city: "Long Beach", country: "USA", lat: 33.7572, lon: -118.2137 },
  { code: "USNYC", name: "Port of New York/New Jersey", city: "New York", country: "USA", lat: 40.6699, lon: -74.0368 },
  { code: "USSAV", name: "Port of Savannah", city: "Savannah", country: "USA", lat: 32.0835, lon: -81.0998 },
  { code: "USHOU", name: "Port of Houston", city: "Houston", country: "USA", lat: 29.7604, lon: -95.3698 },
  { code: "USSEA", name: "Port of Seattle", city: "Seattle", country: "USA", lat: 47.6062, lon: -122.3321 },
  { code: "USTAC", name: "Port of Tacoma", city: "Tacoma", country: "USA", lat: 47.2529, lon: -122.4443 },
  { code: "USOAK", name: "Port of Oakland", city: "Oakland", country: "USA", lat: 37.8044, lon: -122.2712 },
  { code: "USMIA", name: "Port of Miami", city: "Miami", country: "USA", lat: 25.7617, lon: -80.1918 },
  { code: "USCHA", name: "Port of Charleston", city: "Charleston", country: "USA", lat: 32.7765, lon: -79.9311 },
  { code: "USNOR", name: "Port of New Orleans", city: "New Orleans", country: "USA", lat: 29.9511, lon: -90.0715 },
  { code: "CAMTR", name: "Port of Montreal", city: "Montreal", country: "Canada", lat: 45.5017, lon: -73.5673 },
  { code: "CAVAN", name: "Port of Vancouver", city: "Vancouver", country: "Canada", lat: 49.2827, lon: -123.1207 },
  { code: "CAHAL", name: "Port of Halifax", city: "Halifax", country: "Canada", lat: 44.6488, lon: -63.5752 },
  { code: "MXVER", name: "Port of Veracruz", city: "Veracruz", country: "Mexico", lat: 19.1738, lon: -96.1342 },
  { code: "MXMAN", name: "Port of Manzanillo", city: "Manzanillo", country: "Mexico", lat: 19.0514, lon: -104.3189 },
  { code: "MXLZC", name: "Port of Lazaro Cardenas", city: "Lázaro Cárdenas", country: "Mexico", lat: 17.9580, lon: -102.1964 },
  
  // Americas - Central & Caribbean
  { code: "PACOL", name: "Port of Colon", city: "Colon", country: "Panama", lat: 9.3591, lon: -79.9019 },
  { code: "PAPTB", name: "Port of Balboa", city: "Panama City", country: "Panama", lat: 8.9543, lon: -79.5619 },
  { code: "KYKGN", name: "Port of Kingston", city: "Kingston", country: "Jamaica", lat: 17.9714, lon: -76.7930 },
  { code: "BSFPO", name: "Freeport Container Port", city: "Freeport", country: "Bahamas", lat: 26.5285, lon: -78.6964 },
  { code: "DOCAU", name: "Port of Caucedo", city: "Santo Domingo", country: "Dominican Republic", lat: 18.4361, lon: -69.6274 },
  { code: "PRSJN", name: "Port of San Juan", city: "San Juan", country: "Puerto Rico", lat: 18.4655, lon: -66.1057 },
  { code: "HNPCR", name: "Puerto Cortes", city: "Puerto Cortes", country: "Honduras", lat: 15.8399, lon: -87.9406 },
  { code: "GTPRQ", name: "Port of Quetzal", city: "San Jose", country: "Guatemala", lat: 13.9319, lon: -90.7838 },
  
  // Americas - South
  { code: "BRSSZ", name: "Port of Santos", city: "Santos", country: "Brazil", lat: -23.9608, lon: -46.3278 },
  { code: "BRPNG", name: "Port of Paranagua", city: "Paranagua", country: "Brazil", lat: -25.5162, lon: -48.5223 },
  { code: "BRRIO", name: "Port of Rio de Janeiro", city: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729 },
  { code: "BRITJ", name: "Port of Itajaí", city: "Itajaí", country: "Brazil", lat: -26.9078, lon: -48.6619 },
  { code: "ARBUE", name: "Port of Buenos Aires", city: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816 },
  { code: "CLSAI", name: "Port of San Antonio", city: "San Antonio", country: "Chile", lat: -33.5932, lon: -71.6127 },
  { code: "CLVAP", name: "Port of Valparaiso", city: "Valparaiso", country: "Chile", lat: -33.0472, lon: -71.6127 },
  { code: "PECLL", name: "Port of Callao", city: "Lima", country: "Peru", lat: -12.0464, lon: -77.0428 },
  { code: "COGAQ", name: "Port of Cartagena", city: "Cartagena", country: "Colombia", lat: 10.3910, lon: -75.4794 },
  { code: "COBUN", name: "Port of Buenaventura", city: "Buenaventura", country: "Colombia", lat: 3.8801, lon: -77.0190 },
  { code: "ECGYE", name: "Port of Guayaquil", city: "Guayaquil", country: "Ecuador", lat: -2.1894, lon: -79.8891 },
  { code: "UYMVD", name: "Port of Montevideo", city: "Montevideo", country: "Uruguay", lat: -34.9011, lon: -56.1915 },
  
  // Oceania
  { code: "AUMEL", name: "Port of Melbourne", city: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631 },
  { code: "AUSYD", name: "Port of Sydney", city: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { code: "AUBNE", name: "Port of Brisbane", city: "Brisbane", country: "Australia", lat: -27.4698, lon: 153.0251 },
  { code: "AUFRE", name: "Port of Fremantle", city: "Perth", country: "Australia", lat: -32.0569, lon: 115.7439 },
  { code: "NZAKL", name: "Port of Auckland", city: "Auckland", country: "New Zealand", lat: -36.8485, lon: 174.7633 },
  { code: "NZTRG", name: "Port of Tauranga", city: "Tauranga", country: "New Zealand", lat: -37.6878, lon: 176.1651 },
  { code: "PGPOM", name: "Port Moresby", city: "Port Moresby", country: "Papua New Guinea", lat: -9.4438, lon: 147.1803 },
  { code: "FJSUV", name: "Port of Suva", city: "Suva", country: "Fiji", lat: -18.1416, lon: 178.4419 },
];

interface PortSearchProps {
  value: string;
  onChange: (port: Port | null) => void;
  placeholder?: string;
  label?: string;
}

export const PortSearch = ({ value, onChange, placeholder = "Search port...", label }: PortSearchProps) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected port when value changes externally
  useEffect(() => {
    if (value) {
      const found = PORTS_DATABASE.find(p => p.code === value);
      if (found) {
        setSelectedPort(found);
        setQuery(`${found.city} (${found.code})`);
      }
    } else {
      setSelectedPort(null);
      setQuery('');
    }
  }, [value]);

  // Filter ports based on query
  const filteredPorts = useMemo(() => {
    if (!query || selectedPort) return [];
    
    const searchTerm = query.toLowerCase().trim();
    if (searchTerm.length < 1) return [];
    
    return PORTS_DATABASE
      .filter(port => 
        port.city.toLowerCase().includes(searchTerm) ||
        port.code.toLowerCase().includes(searchTerm) ||
        port.name.toLowerCase().includes(searchTerm) ||
        port.country.toLowerCase().includes(searchTerm)
      )
      .slice(0, 8);
  }, [query, selectedPort]);

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
    setSelectedPort(null);
    setShowDropdown(true);
    
    if (!newValue) {
      onChange(null);
    }
  };

  const handleSelect = (port: Port) => {
    setSelectedPort(port);
    setQuery(`${port.city} (${port.code})`);
    onChange(port);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    if (!selectedPort && query.length >= 1) {
      setShowDropdown(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedPort(null);
    onChange(null);
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
          className="pl-9 pr-8 rounded-xl border-[#E5E7EB] focus:border-[#0EA5E9] focus:ring-[#0EA5E9] transition-all"
        />
        {selectedPort && (
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
      {showDropdown && filteredPorts.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-64 overflow-y-auto"
        >
          {filteredPorts.map((port) => (
            <button
              key={port.code}
              type="button"
              onClick={() => handleSelect(port)}
              className={cn(
                "w-full px-3 py-2.5 flex items-start gap-3 hover:bg-[#F0F9FF] transition-colors text-left",
                "first:rounded-t-xl last:rounded-b-xl"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                  <Anchor className="h-4 w-4 text-[#0EA5E9]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1E293B]">{port.code}</span>
                  <span className="text-sm text-[#475569] truncate">{port.city}</span>
                </div>
                <div className="text-xs text-[#64748B] truncate">
                  {port.name} • {port.country}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {showDropdown && query.length >= 1 && !selectedPort && filteredPorts.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-2 text-[#475569]">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">No ports found for "{query}"</span>
          </div>
        </div>
      )}
    </div>
  );
};

export { PORTS_DATABASE };
