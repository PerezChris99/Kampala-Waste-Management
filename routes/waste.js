const Waste = require('../models/waste');
const authMiddleware = require('../middleware/auth');

const wasteRoutes = async (req, res) => {
  await authMiddleware(req, res, async () => {
    if (req.method === 'POST' && req.url === '/waste/add') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        const { type, amount, location } = JSON.parse(body);
        const waste = new Waste({ type, amount, location, userId: req.user._id });
        try {
          await waste.save();
          res.statusCode = 201;
          res.end(JSON.stringify({ message: 'Waste added' }));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ message: err.message }));
        }
      });
    } else if (req.method === 'GET' && req.url === '/waste/all') {
      try {
        const wastes = await Waste.find({ userId: req.user._id });
        res.end(JSON.stringify(wastes));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ message: err.message }));
      }
    }
  });
};

module.exports = wasteRoutes;
