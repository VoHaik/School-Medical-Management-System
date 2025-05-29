/**
 * Custom proxy configuration for Create React App development server
 * This file is automatically recognized by Create React App
 */
module.exports = function(app) {
  // Fix for "options.allowedHosts[0] should be a non-empty string" error
  app.use((req, res, next) => {
    // Set headers to allow requests from localhost
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
};