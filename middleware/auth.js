const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = (requiredRole) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ message: 'Access Denied: No token provided' }));
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ message: 'Access Denied: Invalid user' }));
    }

    req.user = user;

    if (requiredRole && user.role !== requiredRole) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ message: 'Access Denied: Insufficient permissions' }));
    }

    next();
  } catch (err) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ message: 'Invalid Token' }));
  }
};

module.exports = authMiddleware;