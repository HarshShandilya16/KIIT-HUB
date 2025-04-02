// This file will run for all API routes to handle CORS
module.exports = (req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', 'https://kiithub-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Content-Type');
  
  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // For all other requests, continue processing
  return undefined;
}; 