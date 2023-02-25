const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('../../controllers/auth');

/**
 * @apiDefine AuthGroup Auth
 *
 * Handling user authentication
 */

const BodyValidator = require('../../middleware/bodyValidator');

/**
 * @api {get} /auth/login Generate JWT with valid username/password credentials
 * @apiName LoginUser
 * @apiGroup AuthGroup
 */
router.post('/login', BodyValidator('authenticationRequest'), authController.loginUser);

/**
 * @api {get} /auth/logout Invalidate JWT and logout user
 * @apiName LogoutUser
 * @apiGroup AuthGroup
 */
router.post('/logout', authController.logoutUser);

module.exports = router;
