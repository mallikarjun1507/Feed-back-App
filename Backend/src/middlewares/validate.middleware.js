const { validationResult } = require('express-validator');

module.exports = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'error',
      errors: errors.array().map(e => ({
        field: e.param,
        msg: e.msg,
      })),
    });
  }
  next();
};
