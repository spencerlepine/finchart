const mongoose = require('mongoose');
const config = require('../../src/config/config');

module.exports.isDatabaseConnected = () => {
  if (config.NODE_ENV === 'test') {
    return true;
  }

  // 0: disconnected
  // 1: connected
  // 2: connecting
  // 3: disconnecting
  return mongoose.connection.readyState === 1;
};
