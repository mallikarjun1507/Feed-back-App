const jwt = require('jsonwebtoken');
require('dotenv').config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in .env');
  process.exit(1);
}

/**
 * Sign Access Token
 * @param {Object} payload - Data to encode
 * @returns {String} JWT access token
 */
function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
  });
}

/**
 * Sign Refresh Token
 * @param {Object} payload - Data to encode
 * @returns {String} JWT refresh token
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  });
}

/**
 * Verify Token
 * @param {String} token - JWT token
 * @returns {Object} Decoded payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    throw err;
  }
}

module.exports = { signAccessToken, signRefreshToken, verifyToken };
