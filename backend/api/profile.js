// Serverless function for user profile
const connect = require('../src/config/database');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  // IMPORTANT: Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', 'https://kiithub-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');

  // Handle OPTIONS request - MUST be first
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request for profile
  if (req.method === 'GET') {
    try {
      // Get token from cookies
      const cookieHeader = req.headers.cookie || '';
      const tokenCookie = cookieHeader.split(';').find(c => c.trim().startsWith('token='));
      
      if (!tokenCookie) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      const token = tokenCookie.split('=')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-jwt-secret');
      
      // Return mock user data
      return res.status(200).json({
        success: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: 'Test User',
          college: 'KIIT University',
          items: []
        }
      });
    } catch (error) {
      console.error('Profile error:', error);
      
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      
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