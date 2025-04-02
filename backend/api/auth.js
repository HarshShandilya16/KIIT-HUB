// Standalone auth endpoint with no external dependencies
const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  // Set CORS headers - MUST be first
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
      
      // Simple authentication - hardcoded for testing
      if (email && password) {
        const token = jwt.sign(
          { id: 'user123', email },
          process.env.JWT_SECRET || 'fallback-jwt-secret',
          { expiresIn: '1d' }
        );
        
        // Set cookie
        res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=${60*60*24}`);
        
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          user: { id: 'user123', email, name: 'Test User' }
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
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