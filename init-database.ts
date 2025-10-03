import { initializeDatabase } from './pages/api/lib/db-mongo.ts';

async function initDatabase() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();