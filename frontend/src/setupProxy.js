/**
 * Custom proxy configuration for Create React App development server
 * This file is automatically recognized by Create React App
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy middleware for /api to http://localhost:8080');
  
  app.use(
    '/api', // Chỉ proxy các request bắt đầu bằng /api
    createProxyMiddleware({
      target: 'http://localhost:8080', // URL của backend Spring Boot chính
      changeOrigin: true,
      secure: false, // Thường là false cho môi trường dev localhost
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] Forwarding ${req.method} ${req.path} to ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
      },
      onError: (err, req, res, target) => {
        console.error(`[Proxy Error] Could not connect to ${target.href}: ${err.message}`);
        // Không tự động thử lại port khác trong phiên bản đơn giản này
        if (!res.headersSent) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Proxy Error: Could not connect to backend service.', error: err.message }));
        }
      }
    })
  );

  // Nếu bạn có các API khác không bắt đầu bằng /api, bạn có thể thêm các proxy khác ở đây
  // Ví dụ:
  // app.use(
  //   '/auth', 
  //   createProxyMiddleware({
  //     target: 'http://localhost:8080', 
  //     changeOrigin: true,
  //   })
  // );
};
