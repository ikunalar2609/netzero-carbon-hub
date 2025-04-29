
import { Account, Client, Databases, ID, Models, Query } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('YOUR_PROJECT_ID'); // Your project ID - will need to be replaced by the user

// Initialize Appwrite services
const account = new Account(client);
const databases = new Databases(client);

// Database and collection IDs - need to be created by user in Appwrite dashboard
const DATABASE_ID = 'farmlycarbon';
const STANDARDS_COLLECTION_ID = 'standards';
const PROJECTS_COLLECTION_ID = 'projects';
const EMISSIONS_COLLECTION_ID = 'emissions';

// Types
export interface StandardCompliance {
  id: string;
  title: string;
  description: string;
  status: string;
  icon?: string;
}

export interface ReductionProject {
  id: string;
  name: string;
  category: string;
  impact: string;
  reduction: number;
  cost: string;
  timeline: string;
  description?: string;
}

export interface EmissionsData {
  id: string;
  year: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

// Authentication functions
export const createAccount = async (email: string, password: string, name: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    await account.createEmailSession(email, password);
    return newAccount;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    return await account.createEmailSession(email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Standards Compliance functions
export const getStandardsCompliance = async (): Promise<StandardCompliance[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      STANDARDS_COLLECTION_ID
    );
    return response.documents as unknown as StandardCompliance[];
  } catch (error) {
    console.error('Error fetching standards:', error);
    return [];
  }
};

export const createStandardCompliance = async (standard: Omit<StandardCompliance, 'id'>) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      STANDARDS_COLLECTION_ID,
      ID.unique(),
      standard
    );
  } catch (error) {
    console.error('Error creating standard:', error);
    throw error;
  }
};

export const updateStandardCompliance = async (id: string, standard: Partial<StandardCompliance>) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      STANDARDS_COLLECTION_ID,
      id,
      standard
    );
  } catch (error) {
    console.error('Error updating standard:', error);
    throw error;
  }
};

export const deleteStandardCompliance = async (id: string) => {
  try {
    return await databases.deleteDocument(
      DATABASE_ID,
      STANDARDS_COLLECTION_ID,
      id
    );
  } catch (error) {
    console.error('Error deleting standard:', error);
    throw error;
  }
};

// Reduction Projects functions
export const getReductionProjects = async (): Promise<ReductionProject[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID
    );
    return response.documents as unknown as ReductionProject[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const createReductionProject = async (project: Omit<ReductionProject, 'id'>) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      ID.unique(),
      project
    );
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateReductionProject = async (id: string, project: Partial<ReductionProject>) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id,
      project
    );
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteReductionProject = async (id: string) => {
  try {
    return await databases.deleteDocument(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      id
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Emissions Data functions
export const getEmissionsData = async (): Promise<EmissionsData[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      EMISSIONS_COLLECTION_ID
    );
    return response.documents as unknown as EmissionsData[];
  } catch (error) {
    console.error('Error fetching emissions data:', error);
    return [];
  }
};

export const createEmissionsData = async (data: Omit<EmissionsData, 'id'>) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      EMISSIONS_COLLECTION_ID,
      ID.unique(),
      data
    );
  } catch (error) {
    console.error('Error creating emissions data:', error);
    throw error;
  }
};

export const updateEmissionsData = async (id: string, data: Partial<EmissionsData>) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      EMISSIONS_COLLECTION_ID,
      id,
      data
    );
  } catch (error) {
    console.error('Error updating emissions data:', error);
    throw error;
  }
};

export const deleteEmissionsData = async (id: string) => {
  try {
    return await databases.deleteDocument(
      DATABASE_ID,
      EMISSIONS_COLLECTION_ID,
      id
    );
  } catch (error) {
    console.error('Error deleting emissions data:', error);
    throw error;
  }
};

export default {
  client,
  account,
  databases,
  createAccount,
  login,
  logout,
  getCurrentUser,
  getStandardsCompliance,
  createStandardCompliance,
  updateStandardCompliance,
  deleteStandardCompliance,
  getReductionProjects,
  createReductionProject,
  updateReductionProject,
  deleteReductionProject,
  getEmissionsData,
  createEmissionsData,
  updateEmissionsData,
  deleteEmissionsData
};
