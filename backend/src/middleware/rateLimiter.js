const rateLimit = require('express-rate-limit');

/**
 * Rate limiter configurations
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs, // Time window
    max, // Max requests per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests on GET
    skip: (req, res) => req.method === 'GET' && res.statusCode < 400,
  });
};

/**
 * Strict rate limiter for auth endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  skipSuccessfulRequests: false,
  message: 'Too many login attempts, please try again later.',
});

/**
 * Rate limiter for read operations (GET)
 */
const readOperationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500, // 500 requests per minute
  message: 'Too many read requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for write operations (POST, PUT, DELETE, PATCH)
 */
const writeOperationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 150, // 150 requests per minute
  message: 'Too many write requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Relaxed rate limiter for general API (deprecated, keeping for backwards compatibility)
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  skipSuccessfulRequests: true,
});

module.exports = { createRateLimiter, authLimiter, apiLimiter, readOperationLimiter, writeOperationLimiter };
