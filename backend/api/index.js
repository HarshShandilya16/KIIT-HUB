module.exports = (req, res) => {
  // Set explicit CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Return API information
  return res.status(200).json({ 
    name: 'KiitHub API',
    version: '1.0.0',
    status: 'online',
    endpoints: [
      { path: '/api/test', description: 'Test endpoint' },
      { path: '/api/auth', description: 'Authentication endpoint' },
      { path: '/api/profile', description: 'User profile endpoint' },
      { path: '/api/cors', description: 'CORS test endpoint' }
    ],
    timestamp: new Date().toISOString()
  });
}; 