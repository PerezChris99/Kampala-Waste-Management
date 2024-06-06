const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ message: 'Access Denied' }));
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: 'Invalid Token' }));
  }
};

module.exports = authMiddleware;
