import { useState, useEffect } from "react";

interface RegionData {
  country: string;
  region: string;
  city: string;
  timezone: string;
}

export const useRegionDetection = () => {
  const [region, setRegion] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectRegion = async () => {
      try {
        // Try geolocation first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use a reverse geocoding service (mock implementation)
                const mockRegionData = {
                  country: "United States", 
                  region: "US",
                  city: "New York",
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };
                setRegion(mockRegionData);
                setLoading(false);
              } catch (err) {
                console.error("Reverse geocoding failed:", err);
                fallbackToIP();
              }
            },
            () => {
              // Geolocation denied, fall back to IP
              fallbackToIP();
            }
          );
        } else {
          fallbackToIP();
        }
      } catch (err) {
        setError("Failed to detect region");
        setLoading(false);
      }
    };

    const fallbackToIP = async () => {
      try {
        // Mock IP-based detection
        const mockRegionData = {
          country: "United States",
          region: "US", 
          city: "Default",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        setRegion(mockRegionData);
        setLoading(false);
      } catch (err) {
        setError("Failed to detect region via IP");
        setLoading(false);
      }
    };

    detectRegion();
  }, []);

  return { region, loading, error };
};