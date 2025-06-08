/**
 * Custom proxy configuration for Create React App development server
 * This file is automatically recognized by Create React App
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Enhanced proxy configuration with dual port support
  console.log('Setting up proxy middleware for development server');
  
  const PRIMARY_PORT = 8080;
  const SECONDARY_PORT = 8081;
  let currentPort = PRIMARY_PORT;
  
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
  
  const apiProxy = createProxyMiddleware({
    router: (req) => {
      return `http://localhost:${currentPort}`;
    },
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res, options) => {
      console.log(`Proxying ${req.method} ${req.path} to ${options.target.href}`);
      proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
      proxyReq.setHeader('X-Frontend-Path', req.path);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[Port ${currentPort}] Received ${proxyRes.statusCode} for ${req.method} ${req.path}`);
    },
    onError: (err, req, res, target) => {
      const failedPort = target && target.port ? Number(target.port) : currentPort;
      console.error(`Backend connection error (port ${failedPort}): ${err.message}`);
      
      const nextPort = failedPort === PRIMARY_PORT ? SECONDARY_PORT : PRIMARY_PORT;
      console.log(`Attempting to switch to port ${nextPort}`);
      
      const retryProxyInstance = createProxyMiddleware({
        target: `http://localhost:${nextPort}`,
        changeOrigin: true,
        secure: false,
        onProxyReq: (proxyReqRetry, reqRetry, resRetry, optionsRetry) => {
          console.log(`Retrying ${reqRetry.method} ${reqRetry.path} to ${optionsRetry.target.href}`);
        },
        onProxyRes: (proxyResRetry, reqRetry, resRetry) => {
          console.log(`[Port ${nextPort} - Retry] Received ${proxyResRetry.statusCode} for ${reqRetry.method} ${reqRetry.path}`);
        },
        onError: (retryErr, retryReq, retryRes, targetRetry) => {
          const fallbackFailedPort = targetRetry && targetRetry.port ? Number(targetRetry.port) : nextPort;
          console.error(`Fallback port ${fallbackFailedPort} also failed: ${retryErr.message}`);
          
          if (!retryRes.headersSent) {
            retryRes.writeHead(503, { 'Content-Type': 'application/json' });
            retryRes.end(JSON.stringify({
              error: 'Backend Unavailable',
              message: 'Could not connect to backend server on either port. Please ensure the backend is running.',
              details: retryErr.message,
              ports: [PRIMARY_PORT, SECONDARY_PORT]
            }));
          }
        }
      });
      
      currentPort = nextPort;
      
      return retryProxyInstance(req, res, (finalError) => {
        if (finalError && !res.headersSent) {
            console.error(`Internal error during retry proxy execution: ${finalError.message}`);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Proxy Retry Error', message: 'An error occurred while attempting to retry the request.' }));
        }
      });
    }
  });
  
  app.use('/api/auth', (req, res, next) => {
    console.log(`[Auth API] ${req.method} ${req.path}`);
    next();
  });

  app.use('/api', apiProxy);
  
  console.log(`Proxy middleware configured for ports ${PRIMARY_PORT} and ${SECONDARY_PORT}, initially trying ${currentPort}`);
};
