const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 chars long')
      .matches(/[A-Z]/).withMessage('Password must contain uppercase letter')
      .matches(/[^A-Za-z0-9]/).withMessage('Password must contain special char'),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

module.exports = router;
