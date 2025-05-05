
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
    
    // If the API is not available or returns no data, use sample data
    if (!data.projects || data.projects.length === 0) {
      return getSampleProjects();
    }
    
    return data.projects || [];
  } catch (error) {
    console.error("Failed to fetch carbon projects:", error);
    // Return sample data if API fails
    return getSampleProjects();
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
    
    // If the API is not available, use sample data
    if (!data.totalProjects && !data.totalCredits && !data.averagePrice) {
      return getSampleStats();
    }
    
    return {
      totalProjects: data.totalProjects || 0,
      totalCredits: data.totalCredits || 0,
      averagePrice: data.averagePrice || 0
    };
  } catch (error) {
    console.error("Failed to fetch carbon statistics:", error);
    // Return sample data if API fails
    return getSampleStats();
  }
};

/**
 * Returns sample projects data when API is unavailable
 */
const getSampleProjects = (): CarbonProject[] => {
  return [
    {
      id: "1",
      name: "Reforestation Project",
      description: "Large-scale forest restoration in degraded areas",
      price: 15.75,
      category: "Forestry",
      location: "Brazil",
      vintage: "2023",
      imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1000"
    },
    {
      id: "2",
      name: "Solar Farm Initiative",
      description: "Converting farmland to solar energy production",
      price: 22.30,
      category: "Renewable Energy",
      location: "India",
      vintage: "2024",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000"
    },
    {
      id: "3",
      name: "Methane Capture",
      description: "Agricultural waste methane capture and utilization",
      price: 18.45,
      category: "Methane Reduction",
      location: "United States",
      vintage: "2023",
      imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1000"
    },
    {
      id: "4",
      name: "Sustainable Agriculture",
      description: "Converting to sustainable farming practices",
      price: 16.80,
      category: "Agriculture",
      location: "Kenya",
      vintage: "2023",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000"
    },
    {
      id: "5",
      name: "Clean Energy Transition",
      description: "Industrial facility energy efficiency upgrades",
      price: 19.25,
      category: "Industrial Processes",
      location: "Germany",
      vintage: "2024",
      imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1000"
    }
  ];
};

/**
 * Returns sample statistics when API is unavailable
 */
const getSampleStats = (): CarbonStats => {
  return {
    totalProjects: 235,
    totalCredits: 1250000,
    averagePrice: 19.85
  };
};
