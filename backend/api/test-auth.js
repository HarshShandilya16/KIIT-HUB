module.exports = (req, res) => {
  // Log request details for debugging
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  
  // Set CORS headers explicitly
  res.setHeader('Access-Control-Allow-Origin', 'https://kiithub-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST request - just return success
  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      message: 'Test auth endpoint working',
      user: { 
        id: 'test123', 
        email: 'test@example.com', 
        name: 'Test User' 
      },
      timestamp: new Date().toISOString()
    });
  }

  // Handle GET request
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Auth test endpoint is active',
      timestamp: new Date().toISOString()
    });
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    message: 'Method not allowed'
  });
}; 