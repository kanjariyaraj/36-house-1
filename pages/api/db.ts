import { EventTask, TaskStatus, User, UserRole, VendorData, LogisticsStatus, ComplianceDocument, ComplianceDocumentStatus, SponsorshipPackageTier, SponsorData } from '../../types';
import { hashPassword } from './lib/auth';
import { 
  initializeDatabase, 
  getAllTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  getAllVendors,
  getVendorById,
  updateVendor,
  getSponsorByName,
  getUserByEmail,
  createUser,
  updateUser
} from './lib/db-mongo';

// Initialize the database with seed data
initializeDatabase();

// Export all the MongoDB functions
export {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getAllVendors,
  getVendorById,
  updateVendor,
  getSponsorByName,
  getUserByEmail,
  createUser,
  updateUser
};

// Keep the original interfaces for compatibility
interface DbUser {
    id: string;
    email: string;
    role: UserRole;
    passwordHash: string;
    passwordResetToken?: string | null;
    passwordResetTokenExpires?: number | null;
}

// Export the getDB function for compatibility with existing code
export const getDB = async () => {
    return {
        tasks: await getAllTasks(),
        vendors: await getAllVendors(),
        sponsors: [], // Will be populated as needed
        users: [] // Will be populated as needed
    };
};

// Export the saveDB function for compatibility with existing code
export const saveDB = () => {
    // Not needed with MongoDB as changes are saved immediately
    console.log("Using MongoDB - changes are saved immediately");
};