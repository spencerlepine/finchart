const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');
const path = require('path');

const crypto = require('crypto');
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

const generateAccessToken = (username) => {
  return jwt.sign({ username }, config.JWT_TOKEN, { expiresIn: '1800s' });
};

const authenticateCustomUser = (username, password) => {
  const validUsername = username === config.CUSTOM_USERNAME;
  const validPassword = getHashedPassword(password) === config.CUSTOM_HASHED_PASSWORD;

  if (validUsername && validPassword) {
    return true;
  } else {
    logger.error('Auth attempt failure for user:' + username);
  }
  return false;
};

const verifyToken = (token, req, res, next) => {
  jwt.verify(token, config.JWT_TOKEN, (err, user) => {
    if (err) {
      logger.error(err);

      const INDEX_HTML_FILE = path.join(__dirname, '../../../client/build/index.html');
      return res.status(403).sendFile(INDEX_HTML_FILE);
    }
    req.user = user;

    next();
  });
};

module.exports = {
  generateAccessToken,
  authenticateCustomUser,
  verifyToken,
  getHashedPassword,
};
