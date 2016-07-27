const mainRoutes = require('./main');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const configRoutes = require('./config');
const emailRoutes = require('./email');

module.exports = {
  main: mainRoutes,
  auth: authRoutes,
  admin: adminRoutes,
  config: configRoutes,
  email: emailRoutes
};
