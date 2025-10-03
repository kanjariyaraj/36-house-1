// Test the login functionality directly
import { getUserByEmail } from './pages/api/db.ts';
import { comparePassword } from './pages/api/lib/auth.ts';

async function testLogin() {
  try {
    console.log('Testing login with valid credentials...');
    
    // Test getting user by email
    const user = await getUserByEmail('jane.doe@example.com');
    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User data:', JSON.stringify(user, null, 2));
    
    if (user) {
      // Test password comparison
      const isPasswordValid = comparePassword('password123', user.passwordHash);
      console.log('Password valid:', isPasswordValid);
    }
    
    // Test with invalid credentials
    console.log('\nTesting login with invalid credentials...');
    const invalidUser = await getUserByEmail('nonexistent@example.com');
    console.log('Invalid user found:', invalidUser ? 'Yes' : 'No');
    
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

testLogin();