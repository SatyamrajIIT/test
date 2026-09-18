const rateLimit = require('express-rate-limit');

const skipPreflight = (req, res) => {
  return req.method === 'OPTIONS';
};

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
    validate: { trustProxy: false },
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
  skip: skipPreflight,
  validate: { trustProxy: false },
  skipSuccessfulRequests: false,
  message: 'Too many login attempts, please try again later.',
});

/**
 * Rate limiter for read operations (GET)
 */
const readOperationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  skip: skipPreflight,
  validate: { trustProxy: false },
  message: 'Too many read requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for write operations (POST, PUT, DELETE, PATCH)
 */
const writeOperationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  skip: skipPreflight,
  validate: { trustProxy: false },
  message: 'Too many write requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Relaxed rate limiter for general API
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  validate: { trustProxy: false },
  skip: skipPreflight,
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000,
  validate: { trustProxy: false },
  skip: skipPreflight,
});

module.exports = { createRateLimiter, authLimiter, apiLimiter, readOperationLimiter, writeOperationLimiter, globalLimiter, skipPreflight };
