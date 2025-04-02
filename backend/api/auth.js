// Serverless function for authentication
const connect = require('../src/config/database');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // Set CORS headers explicitly
  res.setHeader('Access-Control-Allow-Origin', 'https://kiithub-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle login requests
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      // Simple demo authentication
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
          user: { id: 'user123', email: email, name: 'Demo User' }
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