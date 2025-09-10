const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const ratingController = require('../controllers/rating.controller');

const router = express.Router({ mergeParams: true });

// Normal User: submit a rating for a store
router.post(
  '/',
  authenticate,
  authorize(['USER', 'ADMIN']), 
  ratingController.submitRating
);

// Normal User: update existing rating for a store
router.put(
  '/',
  authenticate,
  authorize(['USER', 'ADMIN']), 
  ratingController.submitRating
);

// All roles can view ratings, but STORE_OWNER cannot edit
router.get(
  '/',
  authenticate,
  authorize(['ADMIN', 'STORE_OWNER', 'USER']), 
  ratingController.getStoreRatings
);

module.exports = router;
