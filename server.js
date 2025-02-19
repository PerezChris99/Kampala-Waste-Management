const http = require('http');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const wasteRoutes = require('./routes/waste');
const errorHandler = require('./middleware/error');
const fs = require('fs'); // Import the file system module
const path = require('path'); // Import the path module

mongoose.connect('mongodb://localhost:27017/waste_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const server = http.createServer((req, res) => {
  // Serve static files
  const publicPath = path.join(__dirname, 'public');
  const filePath = path.join(publicPath, req.url);
  const viewsPath = path.join(__dirname, 'views');

  try {
    if (req.url.startsWith('/auth')) {
      authRoutes(req, res);
    } else if (req.url.startsWith('/waste')) {
      wasteRoutes(req, res);
    }
    // Serve static files
    else if (req.method === 'GET' && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const extname = path.extname(filePath);
      let contentType = 'text/html';
      switch (extname) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
      }

      res.setHeader('Content-Type', contentType);
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Sorry, check with the site admin for error: ${err.code} ..`);
        } else {
          res.statusCode = 200;
          res.end(content);
        }
      });
    }
    // Serve the index.html view
    else if (req.url === '/' || req.url === '/index.html') {
      fs.readFile(path.join(viewsPath, 'index.html'), (err, content) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Sorry, check with the site admin for error: ${err.code} ..`);
        } else {
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.end(content);
        }
      });
    }
    else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  } catch (err) {
    errorHandler(err, req, res);
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});