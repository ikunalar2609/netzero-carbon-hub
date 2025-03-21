
import { Account, Client, Databases } from 'appwrite';

// Initialize the Appwrite client
export const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('your-project-id'); // Replace with your Appwrite project ID

// Initialize Appwrite account and database instances
export const account = new Account(client);
export const databases = new Databases(client);

// Database constants
export const DATABASE_ID = 'carbon-tracker';
export const EMISSIONS_COLLECTION_ID = 'emissions';
export const CATEGORIES_COLLECTION_ID = 'categories';
export const QUALITY_SCORES_COLLECTION_ID = 'quality-scores';
export const GOALS_COLLECTION_ID = 'goals';
export const MILESTONES_COLLECTION_ID = 'milestones';
export const PROJECTS_COLLECTION_ID = 'projects';
