module.exports = (req, res) => {
  // Set explicit CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://kiithub-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Simple response with no dependencies
  return res.status(200).json({ 
    status: 'OK',
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}; 