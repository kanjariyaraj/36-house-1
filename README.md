
## Run Locally

**Prerequisites:** Node.js and MongoDB

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Install and start MongoDB:
   - Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Start MongoDB service (default port: 27017)
4. Configure MongoDB Compass:
   - Download and install MongoDB Compass from [mongodb.com](https://www.mongodb.com/products/tools/compass)
   - Connect to your local MongoDB instance:
     * Connection String: `mongodb://localhost:27017`
     * Database Name: `eventtimeline`
5. Run the app:
   `npm run dev`

## MongoDB Integration

This project now uses MongoDB as its database instead of the in-memory simulation. The database connection is configured through environment variables in `.env.local`:

- `MONGODB_URI`: Connection string for MongoDB (default: `mongodb://localhost:27017/eventtimeline`)
- `MONGODB_DB`: Database name (default: `eventtimeline`)

When the application starts, it will automatically create the necessary collections and populate them with initial data if they are empty.
