const config = require('../../src/config/config');
const { verifyToken } = require('../utils/tokenUtils');

module.exports = (req, res, next) => {
  const authHeader = req.cookies['finchart-auth-token'] || req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || authHeader;

  if (config.PATH_AUTH_WHITELIST.includes(req.path)) {
    return next();
  }

  if (!token) {
    return res.status(401).redirect('/login');
  }

  return verifyToken(token, req, res, next);
};
