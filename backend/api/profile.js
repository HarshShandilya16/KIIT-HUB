// Serverless function for user profile
const connect = require('../src/config/database');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // Set specific origin for CORS when using credentials
  const origin = req.headers.origin;
  const allowedOrigins = ['https://kiithub-frontend.vercel.app', 'http://localhost:3000'];
  
  // Only allow specific origins
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET requests to fetch user profile
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
      
      // In a real app, you would fetch user data from your database
      // Here we're returning mock data based on the token
      return res.status(200).json({
        success: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: 'Demo User',
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
        message: 'Server error, please try again later'
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}; 