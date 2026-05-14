const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // limit each IP to 20 requests per windowMs
  skipSuccessfulRequests: true,
});

const accountCreationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute,
  limit: 2, // limit each IP to 2 requests per windowMs
  message:
    "Too many accounts created from this IP, please try again after a minute",
});

module.exports = {
  authLimiter,
};
