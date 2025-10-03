import { connectToDatabase } from './pages/api/lib/mongodb.ts';

async function testConnection() {
  try {
    const { db } = await connectToDatabase();
    console.log('Successfully connected to MongoDB');
    
    // Test a simple query
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

testConnection();