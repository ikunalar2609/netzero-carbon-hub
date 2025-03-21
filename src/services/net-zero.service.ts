
import { Query } from 'appwrite';
import { databases, DATABASE_ID, MILESTONES_COLLECTION_ID, PROJECTS_COLLECTION_ID } from '../lib/appwrite';
import { 
  EmissionPathway, 
  Milestone, 
  ReductionProject, 
  ScenarioData,
  SummaryMetric
} from '../models/net-zero.model';

export const getEmissionPathways = async (): Promise<EmissionPathway[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'emission-pathways',
      [Query.orderAsc('year')]
    );
    return response.documents as unknown as EmissionPathway[];
  } catch (error) {
    console.error('Error fetching emission pathways:', error);
    return [];
  }
};

export const getMilestones = async (): Promise<Milestone[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      [Query.orderAsc('year')]
    );
    return response.documents as unknown as Milestone[];
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return [];
  }
};

export const getReductionProjects = async (): Promise<ReductionProject[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID
    );
    return response.documents as unknown as ReductionProject[];
  } catch (error) {
    console.error('Error fetching reduction projects:', error);
    return [];
  }
};

export const getScenarioData = async (): Promise<ScenarioData[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'scenario-data',
      [Query.orderAsc('year')]
    );
    return response.documents as unknown as ScenarioData[];
  } catch (error) {
    console.error('Error fetching scenario data:', error);
    return [];
  }
};

export const getSummaryMetrics = async (): Promise<SummaryMetric[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'summary-metrics'
    );
    return response.documents as unknown as SummaryMetric[];
  } catch (error) {
    console.error('Error fetching summary metrics:', error);
    return [];
  }
};
