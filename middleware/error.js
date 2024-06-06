const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Something went wrong!' }));
  };
  
  module.exports = errorHandler;
  