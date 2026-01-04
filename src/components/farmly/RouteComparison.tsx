import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ship, Navigation, Anchor, TrendingDown, ArrowRight, Loader2, Route, Leaf, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Port } from "./PortSearch";

interface RouteOption {
  name: string;
  distance: number;
  waypoints: string[];
  geometry: [number, number][];
  co2: number; // kg CO2e
  estimatedDays: number;
}

interface RouteComparisonProps {
  origin: Port | null;
  destination: Port | null;
  cargoWeight: number;
  shipType: string;
  primaryRoute?: RouteOption;
  onRouteSelect?: (route: RouteOption) => void;
  calculateRoute: (
    origin: { lon: number; lat: number; name?: string },
    destination: { lon: number; lat: number; name?: string },
    avoidWaypoints?: string[]
  ) => { distance: number; geometry: [number, number][]; waypoints: string[] } | null;
  emissionFactor: number; // kg CO2 per tonne-km
}

// Ship types average speeds (knots)
const SHIP_SPEEDS: Record<string, number> = {
  'container': 18,
  'bulk-carrier': 14,
  'oil-tanker': 15,
  'ro-ro': 17,
  'general-cargo': 14,
};

// Check if route should have alternatives
function shouldShowAlternatives(origin: Port, destination: Port): boolean {
  // Routes that typically have Suez vs Cape alternatives
  const euToAsia = 
    (origin.lat > 30 && origin.lon < 45 && destination.lat < 35 && destination.lon > 60) || // Europe to Asia
    (destination.lat > 30 && destination.lon < 45 && origin.lat < 35 && origin.lon > 60); // Asia to Europe
  
  const euToIndian = 
    (origin.lat > 30 && origin.lon < 45 && destination.lat < 10 && destination.lon > 40 && destination.lon < 100) ||
    (destination.lat > 30 && destination.lon < 45 && origin.lat < 10 && origin.lon > 40 && origin.lon < 100);

  // Routes that could use Panama vs Cape
  const atlanticToPacific =
    (origin.lon < -30 && destination.lon > -120 && destination.lon < -70) ||
    (destination.lon < -30 && origin.lon > -120 && origin.lon < -70);

  return euToAsia || euToIndian || atlanticToPacific;
}

// Determine which alternate route to suggest
function getAlternateRouteType(origin: Port, destination: Port, primaryWaypoints: string[]): { name: string; avoidWaypoints: string[] } | null {
  const hasSuez = primaryWaypoints.includes('Suez Canal');
  const hasPanama = primaryWaypoints.includes('Panama Canal');
  const hasCape = primaryWaypoints.includes('Cape of Good Hope');
  
  if (hasSuez) {
    return { name: 'Via Cape of Good Hope', avoidWaypoints: ['Suez Canal', 'Bab el-Mandeb'] };
  }
  if (hasCape && !hasSuez) {
    // Check if Suez could be an alternative
    const originInEurope = origin.lat > 30 && origin.lon < 45;
    const destInEurope = destination.lat > 30 && destination.lon < 45;
    const originInAsia = origin.lon > 60 && origin.lat < 40;
    const destInAsia = destination.lon > 60 && destination.lat < 40;
    
    if ((originInEurope && destInAsia) || (destInEurope && originInAsia)) {
      return { name: 'Via Suez Canal', avoidWaypoints: ['Cape of Good Hope'] };
    }
  }
  if (hasPanama) {
    return { name: 'Via Cape Horn', avoidWaypoints: ['Panama Canal'] };
  }
  
  return null;
}

export const RouteComparison = ({
  origin,
  destination,
  cargoWeight,
  shipType,
  primaryRoute,
  onRouteSelect,
  calculateRoute,
  emissionFactor,
}: RouteComparisonProps) => {
  const [alternateRoute, setAlternateRoute] = useState<RouteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate alternate route when primary route changes
  useEffect(() => {
    if (!origin || !destination || !primaryRoute || primaryRoute.waypoints.length === 0) {
      setAlternateRoute(null);
      return;
    }

    // Only calculate if this route should have alternatives
    if (!shouldShowAlternatives(origin, destination)) {
      setAlternateRoute(null);
      return;
    }

    const altType = getAlternateRouteType(origin, destination, primaryRoute.waypoints);
    if (!altType) {
      setAlternateRoute(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Use a timeout to prevent blocking UI
    const timer = setTimeout(() => {
      try {
        // For Cape route, we need to create a custom route that avoids Suez
        // This is a simplified simulation - in real implementation you'd call the routing API with waypoint constraints
        let altResult: RouteOption | null = null;

        if (altType.name.includes('Cape of Good Hope')) {
          // Simulate Cape route by adding ~40% distance (typical for EU-Asia routes)
          const capeFactor = 1.35 + Math.random() * 0.1; // 35-45% longer
          const capeDistance = Math.round(primaryRoute.distance * capeFactor);
          const speed = SHIP_SPEEDS[shipType] || 15;
          const days = Math.round((capeDistance / 1.852) / (speed * 24)); // km to nm, then days
          const co2 = capeDistance * cargoWeight * emissionFactor;

          altResult = {
            name: altType.name,
            distance: capeDistance,
            waypoints: ['Strait of Gibraltar', 'Cape of Good Hope', 'Strait of Malacca'].filter(w => !primaryRoute.waypoints.includes(w)),
            geometry: [], // We don't have actual geometry for the alternate
            co2,
            estimatedDays: days,
          };
        } else if (altType.name.includes('Suez')) {
          // Suez is typically shorter than Cape
          const suezFactor = 0.65 + Math.random() * 0.1; // 25-35% shorter
          const suezDistance = Math.round(primaryRoute.distance * suezFactor);
          const speed = SHIP_SPEEDS[shipType] || 15;
          const days = Math.round((suezDistance / 1.852) / (speed * 24));
          const co2 = suezDistance * cargoWeight * emissionFactor;

          altResult = {
            name: altType.name,
            distance: suezDistance,
            waypoints: ['Strait of Gibraltar', 'Suez Canal', 'Bab el-Mandeb', 'Strait of Malacca'],
            geometry: [],
            co2,
            estimatedDays: days,
          };
        } else if (altType.name.includes('Cape Horn')) {
          // Cape Horn is much longer than Panama
          const hornFactor = 1.8 + Math.random() * 0.2; // 80-100% longer
          const hornDistance = Math.round(primaryRoute.distance * hornFactor);
          const speed = SHIP_SPEEDS[shipType] || 15;
          const days = Math.round((hornDistance / 1.852) / (speed * 24));
          const co2 = hornDistance * cargoWeight * emissionFactor;

          altResult = {
            name: altType.name,
            distance: hornDistance,
            waypoints: ['Cape Horn'],
            geometry: [],
            co2,
            estimatedDays: days,
          };
        }

        setAlternateRoute(altResult);
      } catch (err) {
        console.error('Error calculating alternate route:', err);
        setError('Could not calculate alternate route');
      } finally {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [origin, destination, primaryRoute, cargoWeight, shipType, emissionFactor]);

  if (!origin || !destination || !primaryRoute) {
    return null;
  }

  // Don't show if no alternate route available
  if (!alternateRoute && !loading) {
    return null;
  }

  const primarySpeed = SHIP_SPEEDS[shipType] || 15;
  const primaryDays = Math.round((primaryRoute.distance / 1.852) / (primarySpeed * 24));
  const primaryCO2 = primaryRoute.distance * cargoWeight * emissionFactor;

  const distanceDiff = alternateRoute ? alternateRoute.distance - primaryRoute.distance : 0;
  const co2Diff = alternateRoute ? alternateRoute.co2 - primaryCO2 : 0;
  const daysDiff = alternateRoute ? alternateRoute.estimatedDays - primaryDays : 0;

  const isShorter = distanceDiff < 0;
  const isLowerEmissions = co2Diff < 0;

  return (
    <Card className="overflow-hidden border-[#E5E7EB] mt-4">
      {/* Header */}
      <button
        onClick={() => setShowComparison(!showComparison)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10 hover:from-[#8B5CF6]/15 hover:to-[#0EA5E9]/15 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] flex items-center justify-center">
            <Route className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-[#1E293B]">Alternative Route Available</h4>
            <p className="text-xs text-[#475569]">Compare routes for optimal emissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-[#8B5CF6]" />}
          {showComparison ? (
            <ChevronUp className="h-5 w-5 text-[#475569]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#475569]" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Route Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Route */}
                <div className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  "bg-gradient-to-br from-[#10B981]/5 to-transparent border-[#10B981]/30"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30">
                        Primary
                      </Badge>
                      <span className="text-sm font-semibold text-[#1E293B]">
                        {primaryRoute.waypoints.length > 0 ? `Via ${primaryRoute.waypoints[0]}` : 'Direct Route'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#475569]">Distance</span>
                      <span className="font-semibold text-[#1E293B]">{primaryRoute.distance.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#475569]">Est. Duration</span>
                      <span className="font-semibold text-[#1E293B]">{primaryDays} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#475569]">CO₂ Emissions</span>
                      <span className="font-semibold text-[#10B981]">{primaryCO2.toFixed(1)} kg</span>
                    </div>
                    {primaryRoute.waypoints.length > 0 && (
                      <div className="pt-2 border-t border-[#E5E7EB]">
                        <div className="flex items-center gap-1 text-xs text-[#475569]">
                          <Navigation className="h-3 w-3" />
                          <span>{primaryRoute.waypoints.join(' → ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alternate Route */}
                {alternateRoute && (
                  <div className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    isLowerEmissions 
                      ? "bg-gradient-to-br from-[#0EA5E9]/5 to-transparent border-[#0EA5E9]/30"
                      : "bg-gradient-to-br from-[#F59E0B]/5 to-transparent border-[#F59E0B]/30"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn(
                          isLowerEmissions 
                            ? "bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/30"
                            : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                        )}>
                          Alternative
                        </Badge>
                        <span className="text-sm font-semibold text-[#1E293B]">{alternateRoute.name}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#475569]">Distance</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1E293B]">{alternateRoute.distance.toLocaleString()} km</span>
                          <span className={cn(
                            "text-xs font-medium",
                            isShorter ? "text-[#10B981]" : "text-[#F59E0B]"
                          )}>
                            {isShorter ? '−' : '+'}{Math.abs(distanceDiff).toLocaleString()} km
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#475569]">Est. Duration</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1E293B]">{alternateRoute.estimatedDays} days</span>
                          <span className={cn(
                            "text-xs font-medium",
                            daysDiff < 0 ? "text-[#10B981]" : "text-[#F59E0B]"
                          )}>
                            {daysDiff < 0 ? '−' : '+'}{Math.abs(daysDiff)} days
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#475569]">CO₂ Emissions</span>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-semibold",
                            isLowerEmissions ? "text-[#10B981]" : "text-[#F59E0B]"
                          )}>
                            {alternateRoute.co2.toFixed(1)} kg
                          </span>
                          <span className={cn(
                            "text-xs font-medium flex items-center gap-0.5",
                            isLowerEmissions ? "text-[#10B981]" : "text-[#F59E0B]"
                          )}>
                            {isLowerEmissions ? <TrendingDown className="h-3 w-3" /> : null}
                            {isLowerEmissions ? '−' : '+'}{Math.abs(co2Diff).toFixed(1)} kg
                          </span>
                        </div>
                      </div>
                      {alternateRoute.waypoints.length > 0 && (
                        <div className="pt-2 border-t border-[#E5E7EB]">
                          <div className="flex items-center gap-1 text-xs text-[#475569]">
                            <Navigation className="h-3 w-3" />
                            <span>{alternateRoute.waypoints.join(' → ')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {loading && !alternateRoute && (
                  <div className="p-4 rounded-xl border-2 border-dashed border-[#E5E7EB] flex items-center justify-center">
                    <div className="flex items-center gap-2 text-[#475569]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Calculating alternate route...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              {alternateRoute && (
                <div className={cn(
                  "p-3 rounded-lg flex items-center gap-3",
                  isLowerEmissions 
                    ? "bg-[#10B981]/10" 
                    : "bg-[#0EA5E9]/10"
                )}>
                  <Leaf className={cn(
                    "h-5 w-5",
                    isLowerEmissions ? "text-[#10B981]" : "text-[#0EA5E9]"
                  )} />
                  <div className="text-sm">
                    {isLowerEmissions ? (
                      <span className="text-[#10B981] font-medium">
                        {alternateRoute.name} saves {Math.abs(co2Diff).toFixed(1)} kg CO₂ 
                        but adds {Math.abs(distanceDiff).toLocaleString()} km ({Math.abs(daysDiff)} days)
                      </span>
                    ) : (
                      <span className="text-[#0EA5E9] font-medium">
                        Primary route saves {Math.abs(co2Diff).toFixed(1)} kg CO₂ and 
                        {Math.abs(distanceDiff).toLocaleString()} km ({Math.abs(daysDiff)} days)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};