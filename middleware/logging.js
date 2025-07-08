const logger = require("./logger");

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? "error" : "info";

    logger[logLevel]("HTTP Request", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
      userId: req.session?.user?.id,
    });
  });

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error("Application Error", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.session?.user?.id,
    ip: req.ip,
  });

  next(err);
};

module.exports = {
  requestLogger,
  errorLogger,
};
