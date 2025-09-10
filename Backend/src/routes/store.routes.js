const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const storeController = require('../controllers/store.controller');
const ratingController = require('../controllers/rating.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

// Admin creates store
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [body('name').isLength({ min: 3 }), body('address').optional().isLength({ max: 400 })],
  validate,
  storeController.createStore
);

// List stores (everyone) with user rating if logged in
router.get('/', authenticate, storeController.listStores);

// Get store ratings (viewable by all roles)
router.get(
  '/:storeId/ratings',
  authenticate,
  authorize(['ADMIN', 'USER', 'STORE_OWNER']),
  storeController.getStoreRatings
);

// Submit rating (only USER)
router.post(
  '/:storeId/ratings',
  authenticate,
  authorize('USER'),
  [body('rating').isInt({ min: 1, max: 5 })],
  validate,
  ratingController.submitRating
);

// Update rating (USER for own, ADMIN for any)
router.put(
  '/:storeId/ratings',
  authenticate,
  authorize(['USER', 'ADMIN']),
  [body('rating').isInt({ min: 1, max: 5 })],
  validate,
  ratingController.submitRating
);

module.exports = router;
