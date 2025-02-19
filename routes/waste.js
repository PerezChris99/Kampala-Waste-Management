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
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        const wastes = await Waste.find({ userId: req.user._id })
          .skip(skip)
          .limit(limit);

        const totalWastes = await Waste.countDocuments({ userId: req.user._id });

        const response = {
          wastes,
          page,
          limit,
          totalWastes,
          totalPages: Math.ceil(totalWastes / limit),
        };

        res.end(JSON.stringify(response));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ message: err.message }));
      }
    } else if (req.method === 'GET' && req.url.startsWith('/waste/')) {
      const wasteId = req.url.split('/')[2]; // Extract waste ID from URL
      try {
        const waste = await Waste.findOne({ _id: wasteId, userId: req.user._id });
        if (!waste) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ message: 'Waste not found' }));
        }
        res.end(JSON.stringify(waste));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ message: err.message }));
      }
    }
  });
};

module.exports = wasteRoutes;