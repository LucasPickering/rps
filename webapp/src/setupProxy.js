const proxy = require('http-proxy-middleware');

const target = process.env.RPS_API_HOST || 'http://localhost:8000';

module.exports = app => {
  app.use(proxy('/api/', { target }));
  app.use(proxy('/ws/', { target, ws: true }));
};
