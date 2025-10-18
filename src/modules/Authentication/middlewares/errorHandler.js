export const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    const details = err.details || undefined;
  
    const response = { message };
    if (details) response.details = details;
    if (process.env.NODE_ENV !== "production" && err.stack) response.stack = err.stack;
  
    res.status(status).json(response);
};