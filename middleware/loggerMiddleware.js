const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  // Log request details
  console.log(`Incoming request: ${req.method} ${req.url}`);

  res.on("finish", () => {
    // Calculate response time
    const duration = Date.now() - start;
    // Log response details
    console.log(`Response status: ${res.statusCode}`);
    console.log(`Response time: ${duration}ms`);
  });

  next();
};

module.exports = loggerMiddleware;
