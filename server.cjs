const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectToDatabase } = require('./pages/api/lib/mongodb.cjs');
const { getUserByEmail, createUser } = require('./pages/api/lib/db-mongo.cjs');
const { createJwt, comparePassword, hashPassword } = require('./pages/api/lib/auth.cjs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const userRecord = await getUserByEmail(email);

    if (!userRecord || !comparePassword(password, userRecord.passwordHash)) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const userForToken = { id: userRecord.id, email: userRecord.email, role: userRecord.role };
    const token = createJwt({ sub: userRecord.id, email: userRecord.email, role: userRecord.role });

    res.status(200).json({ token, user: userForToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      passwordHash: hashPassword(password),
      role,
    };
    
    const createdUser = await createUser(newUser);
    
    if (!createdUser) {
      return res.status(500).json({ message: 'Failed to create user.' });
    }
    
    const userForToken = { id: newUser.id, email: newUser.email, role: newUser.role };
    const token = createJwt({ sub: newUser.id, email: newUser.email, role: newUser.role });

    res.status(201).json({ token, user: userForToken });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});