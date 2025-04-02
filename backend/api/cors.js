// Simple CORS preflight handler
module.exports = (req, res) => {
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

  // Simple response to confirm CORS is working
  return res.status(200).json({
    success: true,
    message: 'CORS is working correctly',
    origin: origin || 'No origin header',
    timestamp: new Date().toISOString()
  });
}; 