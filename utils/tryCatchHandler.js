const tryCatchHandler = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);  // Pass `next` to the controller
  } catch (error) {
    return next(error);  // Forward any errors to the next middleware
  }
};

module.exports = tryCatchHandler;

