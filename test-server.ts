// Simple test server to check API endpoints
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(join(__dirname, 'dist')));

// Test login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    // Import and use the actual login handler
    const { default: loginHandler } = await import('./pages/api/auth/login.ts');
    
    // Create mock Next.js request/response objects
    const mockReq = {
      method: 'POST',
      body: req.body,
      headers: req.headers
    };
    
    const mockRes = {
      statusCode: 200,
      headers: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      setHeader: function(name, value) {
        this.headers[name] = value;
        return this;
      },
      json: function(data) {
        console.log(`Response Status: ${this.statusCode}`);
        console.log('Response Data:', JSON.stringify(data, null, 2));
        res.status(this.statusCode).json(data);
        return this;
      }
    };
    
    await loginHandler(mockReq, mockRes);
  } catch (error) {
    console.error('Error in login endpoint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});