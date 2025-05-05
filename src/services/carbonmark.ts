
/**
 * Service for interacting with the Carbonmark API
 * API endpoint: https://v16.api.carbonmark.com
 */

export interface CarbonProject {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  location: string;
  vintage: string;
  imageUrl?: string;
}

export interface CarbonStats {
  totalProjects: number;
  totalCredits: number;
  averagePrice: number;
}

const API_URL = "https://v16.api.carbonmark.com";

/**
 * Fetches featured carbon projects from the Carbonmark API
 */
export const getFeaturedProjects = async (): Promise<CarbonProject[]> => {
  try {
    const response = await fetch(`${API_URL}/projects/featured`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error("Failed to fetch carbon projects:", error);
    return [];
  }
};

/**
 * Fetches carbon market statistics
 */
export const getCarbonStats = async (): Promise<CarbonStats> => {
  try {
    const response = await fetch(`${API_URL}/statistics`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      totalProjects: data.totalProjects || 0,
      totalCredits: data.totalCredits || 0,
      averagePrice: data.averagePrice || 0
    };
  } catch (error) {
    console.error("Failed to fetch carbon statistics:", error);
    return {
      totalProjects: 0,
      totalCredits: 0,
      averagePrice: 0
    };
  }
};
