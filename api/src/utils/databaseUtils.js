const mongoose = require('mongoose');
const config = require('../../src/config/config');

module.exports.isDatabaseConnected = () => {
  // 0: disconnected
  // 1: connected
  // 2: connecting
  // 3: disconnecting
  if (config.NODE_ENV !== 'production') {
    return true;
  }

  return mongoose.connection.readyState === 1;
};
