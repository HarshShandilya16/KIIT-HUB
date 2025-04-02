// Profile endpoint with MongoDB connection
const jwt = require('jsonwebtoken');
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
      
      if (!decoded.id) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token data'
        });
      }

      try {
        // Connect to MongoDB
        await connect();
        
        // Get User model and find the user
        const User = getUserModel();
        const user = await User.findById(decoded.id).lean();
        
        if (!user) {
          // Fall back to mock data if user not found (helpful for testing)
          return res.status(200).json({
            success: true,
            user: {
              _id: decoded.id,
              name: 'Test User',
              email_id: decoded.email,
              college_name: 'KIIT University',
              list: [],
              favourite_list: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            note: 'Using fallback data - user not found in database'
          });
        }
        
        // Return real user data
        return res.status(200).json({
          success: true,
          user
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        
        // Fall back to mock data if database connection fails
        return res.status(200).json({
          success: true,
          user: {
            _id: decoded.id,
            name: 'Test User (DB Error)',
            email_id: decoded.email,
            college_name: 'KIIT University',
            list: [],
            favourite_list: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          note: 'Using fallback data - database connection failed'
        });
      }
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