
import { databases, DATABASE_ID, CATEGORIES_COLLECTION_ID, QUALITY_SCORES_COLLECTION_ID } from '../lib/appwrite';
import { ImpactCategory, QualityScore } from '../models/carbon-impact.model';

export const getImpactCategories = async (): Promise<ImpactCategory[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CATEGORIES_COLLECTION_ID
    );
    return response.documents as unknown as ImpactCategory[];
  } catch (error) {
    console.error('Error fetching impact categories:', error);
    return [];
  }
};

export const getQualityScores = async (): Promise<QualityScore[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      QUALITY_SCORES_COLLECTION_ID
    );
    return response.documents as unknown as QualityScore[];
  } catch (error) {
    console.error('Error fetching quality scores:', error);
    return [];
  }
};
