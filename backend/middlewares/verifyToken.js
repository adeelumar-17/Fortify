const jwt = require('jsonwebtoken'); // Import JWT library

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization'); // Look for token in the "Authorization" header
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify the token with the secret key stored in your environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user info (e.g., user ID) to the request object
    req.user = decoded;
    
    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    // If the token is invalid or expired
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
