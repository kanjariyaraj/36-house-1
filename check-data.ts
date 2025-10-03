import { connectToDatabase } from './pages/api/lib/mongodb.ts';
import { getAllTasks, getAllVendors } from './pages/api/lib/db-mongo.ts';

async function checkData() {
  try {
    const { db } = await connectToDatabase();
    
    // Check users collection
    const users = await db.collection('users').find({}).toArray();
    console.log(`Users count: ${users.length}`);
    console.log('Sample users:', users.slice(0, 2));
    
    // Check tasks collection
    const tasks = await db.collection('tasks').find({}).toArray();
    console.log(`Tasks count: ${tasks.length}`);
    console.log('Sample tasks:', tasks.slice(0, 2));
    
    // Check vendors collection
    const vendors = await db.collection('vendors').find({}).toArray();
    console.log(`Vendors count: ${vendors.length}`);
    console.log('Sample vendors:', vendors.slice(0, 2));
    
    // Check sponsors collection
    const sponsors = await db.collection('sponsors').find({}).toArray();
    console.log(`Sponsors count: ${sponsors.length}`);
    console.log('Sample sponsors:', sponsors.slice(0, 2));
  } catch (error) {
    console.error('Error checking data:', error);
  }
}

checkData();