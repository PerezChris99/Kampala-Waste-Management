const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRoutes = async (req, res) => {
  if (req.method === 'POST' && req.url === '/auth/register') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { username, password, role } = JSON.parse(body);
      const user = new User({ username, password, role });
      try {
        await user.save();
        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'User created' }));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: err.message }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/auth/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { username, password } = JSON.parse(body);
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }
      const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
      res.end(JSON.stringify({ token }));
    });
  }
};

module.exports = authRoutes;
