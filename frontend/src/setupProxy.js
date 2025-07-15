/**
 * Custom proxy configuration for Create React App development server
 * This file is automatically recognized by Create React App
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Ch? proxy các request b?t d?u b?ng /api
    createProxyMiddleware({
      target: 'http://localhost:8080', // URL c?a backend Spring Boot chính
      changeOrigin: true,
      secure: false, // Thu?ng là false cho môi tru?ng dev localhost
      // Không dùng pathRewrite vì backend dã có /api trong @RequestMapping
      onProxyReq: (proxyReq, req, res) => {
        },
      onError: (err, req, res, target) => {
        console.error(`[Proxy Error] Could not connect to ${target.href}: ${err.message}`);
        // Không t? d?ng th? l?i port khác trong phiên b?n don gi?n này
        if (!res.headersSent) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Proxy Error: Could not connect to backend service.', error: err.message }));
        }
      }
    })
  );

  // N?u b?n có các API khác không b?t d?u b?ng /api, b?n có th? thêm các proxy khác ? dây
  // Ví d?:
  // app.use(
  //   '/auth', 
  //   createProxyMiddleware({
  //     target: 'http://localhost:8080', 
  //     changeOrigin: true,
  //   })
  // );
};
