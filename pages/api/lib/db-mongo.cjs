const { hashPassword } = require('./auth.cjs');
const { connectToDatabase } = require('./mongodb.cjs');

// Collection names
const TASKS_COLLECTION = 'tasks';
const VENDORS_COLLECTION = 'vendors';
const SPONSORS_COLLECTION = 'sponsors';
const USERS_COLLECTION = 'users';

// Initial data
const initialTasks = [
    { id: 1, title: "Finalize Venue Contract", description: "Negotiate and sign the contract with 'The Grand Hall'.", assignee: "Alex Chen", dueDate: "2024-09-10", status: "Completed" },
    { id: 2, title: "Secure Keynote Speaker", description: "Confirm Dr. Evelyn Reed as the keynote speaker.", assignee: "Brenda Miles", dueDate: "2024-09-15", status: "Completed" },
    { id: 3, title: "Launch Event Website & Ticketing", description: "Go live with the event website and open registration.", assignee: "Casey Lee", dueDate: "2024-09-20", status: "InProgress" },
    { id: 4, title: "Vendor Vetting: Catering", description: "Review proposals and select a catering partner.", assignee: "Alex Chen", dueDate: "2024-10-05", status: "Upcoming" },
    { id: 5, title: "Sponsorship Packages Sent Out", description: "Distribute sponsorship prospectus to potential partners.", assignee: "David Garcia", dueDate: "2024-10-10", status: "InProgress" },
    { id: 6, title: "Design & Order Event Swag", description: "Finalize designs for t-shirts, bags, and notepads.", assignee: "Fiona Kim", dueDate: "2024-10-25", status: "Upcoming" },
    { id: 7, title: "Finalize A/V Partner", description: "Select and contract the audio/visual technical crew.", assignee: "Alex Chen", dueDate: "2024-10-30", status: "Upcoming" },
];

const initialComplianceDocs = [
    { id: 1, vendorId: 'Alex Chen', documentName: 'General Liability Insurance 2024', documentType: 'General Liability Insurance', fileName: 'liability_insurance_2024.pdf', submittedDate: '2024-08-15', status: 'Approved' },
    { id: 2, vendorId: 'Alex Chen', documentName: 'Food Handler Certification', documentType: 'Food Handler Certification', fileName: 'food_cert.pdf', submittedDate: '2024-08-20', status: 'Pending' },
    { id: 3, vendorId: 'Fiona Kim', documentName: 'Business License', documentType: 'Business License', fileName: 'fiona_kim_biz_license.pdf', submittedDate: '2024-08-22', status: 'Pending' },
];

const initialVendors = [
    {
        vendorId: 'Alex Chen',
        performance: { onTimePercentage: 98, complianceScore: 75, organizerRating: 4 },
        logistics: [{ id: 1, taskName: 'Catering Delivery', scheduledTime: '2024-09-19 09:00', status: 'Scheduled' }],
        documents: initialComplianceDocs.filter(d => d.vendorId === 'Alex Chen'),
    },
    {
        vendorId: 'Fiona Kim',
        performance: { onTimePercentage: 100, complianceScore: 50, organizerRating: 3 },
        logistics: [{ id: 4, taskName: 'Swag Delivery', scheduledTime: '2024-09-18 14:00', status: 'Completed' }],
        documents: initialComplianceDocs.filter(d => d.vendorId === 'Fiona Kim'),
    }
];

const initialSponsors = [{
    sponsorName: 'InnovateCorp',
    packageTier: 'Gold',
    leads: [
        { id: 1, name: 'John Doe', email: 'john.d@example.com', scannedAt: '2024-09-20T10:30:00Z' },
        { id: 2, name: 'Jane Smith', email: 'jane.s@example.com', scannedAt: '2024-09-20T11:15:00Z' },
    ],
    boothVisits: 124,
    roi: 250,
}];

const initialUsers = [
    { id: 'attendee-001', email: 'jane.doe@example.com', role: 'Attendee', passwordHash: hashPassword('password123'), passwordResetToken: null, passwordResetTokenExpires: null },
    { id: 'attendee-002', email: 'john.smith@example.com', role: 'Attendee', passwordHash: hashPassword('password123'), passwordResetToken: null, passwordResetTokenExpires: null },
    { id: 'organizer-001', email: 'organizer@example.com', role: 'Organizer', passwordHash: hashPassword('password123'), passwordResetToken: null, passwordResetTokenExpires: null },
    { id: 'admin-001', email: 'admin@example.com', role: 'Admin', passwordHash: hashPassword('password123'), passwordResetToken: null, passwordResetTokenExpires: null },
    { id: 'vendor-001', email: 'alex.chen.vendor@example.com', role: 'Vendor', passwordHash: hashPassword('password123'), passwordResetToken: null, passwordResetTokenExpires: null },
    { id: 'vendor-002', email: 'fiona.kim.vendor@example.com', role: 'Vendor', passwordHash: hashPassword('password123'), passwordResetToken: null, passwordResetTokenExpires: null },
    { id: 'sponsor-001', email: 'contact@innovatecorp.com', role: 'Sponsor', passwordHash: hashPassword('password123'), passwordResetToken: null, passwordResetTokenExpires: null },
];

async function initializeDatabase() {
    try {
        const { db } = await connectToDatabase();
        
        // Check if collections already have data
        const tasksCount = await db.collection(TASKS_COLLECTION).countDocuments();
        const vendorsCount = await db.collection(VENDORS_COLLECTION).countDocuments();
        const sponsorsCount = await db.collection(SPONSORS_COLLECTION).countDocuments();
        const usersCount = await db.collection(USERS_COLLECTION).countDocuments();
        
        // Only insert initial data if collections are empty
        if (tasksCount === 0) {
            await db.collection(TASKS_COLLECTION).insertMany(initialTasks);
        }
        
        if (vendorsCount === 0) {
            await db.collection(VENDORS_COLLECTION).insertMany(initialVendors);
        }
        
        if (sponsorsCount === 0) {
            await db.collection(SPONSORS_COLLECTION).insertMany(initialSponsors);
        }
        
        if (usersCount === 0) {
            await db.collection(USERS_COLLECTION).insertMany(initialUsers);
        }
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Task operations
async function getAllTasks() {
    try {
        const { db } = await connectToDatabase();
        const tasks = await db.collection(TASKS_COLLECTION).find({}).toArray();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

async function getTaskById(id) {
    try {
        const { db } = await connectToDatabase();
        const task = await db.collection(TASKS_COLLECTION).findOne({ id });
        return task;
    } catch (error) {
        console.error('Error fetching task:', error);
        return null;
    }
}

async function createTask(task) {
    try {
        const { db } = await connectToDatabase();
        
        // Get the next ID
        const latestTask = await db.collection(TASKS_COLLECTION)
            .find({})
            .sort({ id: -1 })
            .limit(1)
            .toArray();
        
        const nextId = latestTask.length > 0 ? latestTask[0].id + 1 : 1;
        const newTask = { ...task, id: nextId };
        
        await db.collection(TASKS_COLLECTION).insertOne(newTask);
        return newTask;
    } catch (error) {
        console.error('Error creating task:', error);
        return null;
    }
}

async function updateTask(id, updates) {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection(TASKS_COLLECTION).findOneAndUpdate(
            { id },
            { $set: updates },
            { returnDocument: 'after' }
        );
        return result;
    } catch (error) {
        console.error('Error updating task:', error);
        return null;
    }
}

async function deleteTask(id) {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection(TASKS_COLLECTION).deleteOne({ id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting task:', error);
        return false;
    }
}

// Vendor operations
async function getAllVendors() {
    try {
        const { db } = await connectToDatabase();
        const vendors = await db.collection(VENDORS_COLLECTION).find({}).toArray();
        return vendors;
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return [];
    }
}

async function getVendorById(vendorId) {
    try {
        const { db } = await connectToDatabase();
        const vendor = await db.collection(VENDORS_COLLECTION).findOne({ vendorId });
        return vendor;
    } catch (error) {
        console.error('Error fetching vendor:', error);
        return null;
    }
}

async function updateVendor(vendorId, updates) {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection(VENDORS_COLLECTION).findOneAndUpdate(
            { vendorId },
            { $set: updates },
            { returnDocument: 'after' }
        );
        return result;
    } catch (error) {
        console.error('Error updating vendor:', error);
        return null;
    }
}

// Sponsor operations
async function getSponsorByName(sponsorName) {
    try {
        const { db } = await connectToDatabase();
        const sponsor = await db.collection(SPONSORS_COLLECTION).findOne({ sponsorName });
        return sponsor;
    } catch (error) {
        console.error('Error fetching sponsor:', error);
        return null;
    }
}

// User operations
async function getUserByEmail(email) {
    try {
        const { db } = await connectToDatabase();
        const user = await db.collection(USERS_COLLECTION).findOne({ email });
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

async function createUser(userData) {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection(USERS_COLLECTION).insertOne(userData);
        return result.insertedId ? { ...userData, _id: result.insertedId } : null;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}

async function updateUser(email, updates) {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection(USERS_COLLECTION).findOneAndUpdate(
            { email },
            { $set: updates },
            { returnDocument: 'after' }
        );
        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
}

module.exports = {
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
};