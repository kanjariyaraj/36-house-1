const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventtimeline';
const MONGODB_DB = process.env.MONGODB_DB || 'eventtimeline';

// Global variables to maintain connection across hot reloads in development
let global = {};
let client;
let mongoClientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to prevent multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  mongoClientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each request
  client = new MongoClient(MONGODB_URI);
  mongoClientPromise = client.connect();
}

async function connectToDatabase() {
  const client = await mongoClientPromise;
  const db = client.db(MONGODB_DB);
  return { client, db };
}

async function disconnectFromDatabase() {
  const client = await mongoClientPromise;
  await client.close();
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase
};