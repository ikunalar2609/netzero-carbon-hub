
import { Query } from 'appwrite';
import { databases, EMISSIONS_COLLECTION_ID, DATABASE_ID } from '../lib/appwrite';
import { CategoryComparison, CategoryEmission, EmissionsData, IntensityData } from '../models/emissions.model';

export const getYearlyEmissions = async (): Promise<EmissionsData[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      EMISSIONS_COLLECTION_ID,
      [Query.orderAsc('year')]
    );
    return response.documents as unknown as EmissionsData[];
  } catch (error) {
    console.error('Error fetching yearly emissions:', error);
    return [];
  }
};

export const getMonthlyEmissions = async (year: string): Promise<EmissionsData[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      EMISSIONS_COLLECTION_ID,
      [Query.equal('year', year), Query.notEqual('month', 'null'), Query.orderAsc('month')]
    );
    return response.documents as unknown as EmissionsData[];
  } catch (error) {
    console.error('Error fetching monthly emissions:', error);
    return [];
  }
};

export const getCategoryEmissions = async (scopeType: 'scope1' | 'scope2' | 'scope3'): Promise<CategoryEmission[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'emission-categories',
      [Query.equal('scopeType', scopeType)]
    );
    return response.documents as unknown as CategoryEmission[];
  } catch (error) {
    console.error(`Error fetching ${scopeType} categories:`, error);
    return [];
  }
};

export const getCategoryComparisons = async (): Promise<CategoryComparison[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'category-comparisons'
    );
    return response.documents as unknown as CategoryComparison[];
  } catch (error) {
    console.error('Error fetching category comparisons:', error);
    return [];
  }
};

export const getIntensityData = async (): Promise<IntensityData[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'intensity-data',
      [Query.orderAsc('year')]
    );
    return response.documents as unknown as IntensityData[];
  } catch (error) {
    console.error('Error fetching intensity data:', error);
    return [];
  }
};
