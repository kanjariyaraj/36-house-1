/**
 * MongoDB Compass Setup Script
 * 
 * This script provides instructions for setting up MongoDB Compass
 * to work with the event timeline application.
 */

console.log(`
==================================================
MongoDB Compass Setup for Event Timeline App
==================================================

Follow these steps to configure MongoDB Compass:

1. Launch MongoDB Compass
2. Click "New Connection" or use the connection form
3. Enter the connection string:
   mongodb://localhost:27017/eventtimeline

4. Click "Connect"
5. You should see the "eventtimeline" database with the following collections:
   - tasks
   - vendors
   - sponsors
   - users

6. To view initial data:
   - Click on any collection
   - Browse documents to see the initial data

==================================================
Connection Details:
==================================================
Host: localhost
Port: 27017
Database: eventtimeline
Collections: tasks, vendors, sponsors, users

==================================================
Troubleshooting:
==================================================
If you can't connect:
1. Ensure MongoDB is running (mongod service)
2. Check that MongoDB is listening on port 27017
3. Verify firewall settings if applicable

If collections appear empty:
1. Start the application at least once to initialize data
2. Check the console for any database initialization errors
`);