// Serverless function for authentication
const connect = require('../src/config/database');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  // ===== IMPORTANT: CORS headers must be set before any other logic =====
  // Set CORS headers explicitly
  res.setHeader('Access-Control-Allow-Origin', 'https://kiithub-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');

  // Handle preflight OPTIONS request - MUST be first
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Now handle the actual auth logic
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      // Simple demo authentication - no database connection for now
      if (email && password) {
        const token = jwt.sign(
          { id: 'user123', email: email },
          process.env.JWT_SECRET || 'fallback-jwt-secret',
          { expiresIn: '1d' }
        );
        
        // Set cookie with secure settings
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${60*60*24}`);
        
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          user: { id: 'user123', email: email, name: 'Test User' }
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    } catch (error) {
      console.error('Login error:', error);
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