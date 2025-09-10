const jwt = require('jsonwebtoken');

module.exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Verify token (make sure JWT_SECRET is set in .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');

    // Normalize user object for consistency
    req.user = {
      id: decoded.id || decoded.userId || decoded._id, 
      role: decoded.role || 'USER', 
      email: decoded.email || null,
      ...decoded 
    };

    if (!req.user.id) {
      return res.status(401).json({ message: 'Invalid token payload: missing user id' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: ' + err.message });
  }
};
