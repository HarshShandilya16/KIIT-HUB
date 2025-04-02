// Auth endpoint with MongoDB connection
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connect, getUserModel } = require('./db');

module.exports = async (req, res) => {
  // IMPORTANT: Set CORS headers first - before any potential errors
  res.setHeader('Access-Control-Allow-Origin', 'https://kiithub-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST request for login
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
      
      try {
        // Connect to MongoDB
        await connect();
        
        // Get User model and find the user by email
        const User = getUserModel();
        const user = await User.findOne({ email_id: email });
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }
        
        // Create JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email_id },
          process.env.JWT_SECRET || 'fallback-jwt-secret',
          { expiresIn: '7d' }
        );
        
        // Set cookie
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${60*60*24*7}`);
        
        // Return success with user data
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          user: {
            _id: user._id,
            name: user.name,
            email_id: user.email_id,
            college_name: user.college_name || 'KIIT University'
          }
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        
        // Fallback to test authentication for development/testing
        if (email === 'test@example.com' && password === 'password123') {
          const token = jwt.sign(
            { id: 'test123', email },
            process.env.JWT_SECRET || 'fallback-jwt-secret',
            { expiresIn: '1d' }
          );
          
          res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${60*60*24}`);
          
          return res.status(200).json({
            success: true,
            message: 'Login successful (Fallback mode)',
            user: { _id: 'test123', name: 'Test User', email_id: email },
            note: 'Using fallback authentication - database connection failed'
          });
        }
        
        return res.status(500).json({
          success: false,
          message: 'Database connection error'
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}; 