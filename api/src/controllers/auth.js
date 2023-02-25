const { generateAccessToken, authenticateCustomUser } = require('../utils/tokenUtils');
const { FINCHART_AUTH_TOKEN } = require('../../@finchart-configs/constants');

module.exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (authenticateCustomUser(username, password) === false) {
    return res.status(403).json({ error: 'Incorrect username or password' });
  }

  const token = generateAccessToken(username);
  res
    .status(201)
    .cookie(FINCHART_AUTH_TOKEN, token, {
      httpOnly: true,
      secure: true,
    })
    .json(token);
};

module.exports.logoutUser = (req, res) => {
  res.cookie(FINCHART_AUTH_TOKEN, 'invalid', {
    httpOnly: true,
    secure: true,
  });

  res.status(201).json({ message: 'Successfully logged out!' });
};
