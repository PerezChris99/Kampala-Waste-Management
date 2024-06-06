const http = require('http');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const wasteRoutes = require('./routes/waste');
const errorHandler = require('./middleware/error');

mongoose.connect('mongodb://localhost:27017/waste_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    if (req.url.startsWith('/auth')) {
      authRoutes(req, res);
    } else if (req.url.startsWith('/waste')) {
      wasteRoutes(req, res);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
