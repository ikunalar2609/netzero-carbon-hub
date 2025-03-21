
import { databases, DATABASE_ID } from '../lib/appwrite';
import { Goal, ReductionStatus, SummaryCard } from '../models/dashboard.model';

export const getSummaryCards = async (): Promise<SummaryCard[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'summary-cards'
    );
    return response.documents as unknown as SummaryCard[];
  } catch (error) {
    console.error('Error fetching summary cards:', error);
    return [];
  }
};

export const getReductionStatuses = async (): Promise<ReductionStatus[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'reduction-statuses'
    );
    return response.documents as unknown as ReductionStatus[];
  } catch (error) {
    console.error('Error fetching reduction statuses:', error);
    return [];
  }
};

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      GOALS_COLLECTION_ID
    );
    return response.documents as unknown as Goal[];
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};
