const { Rating } = require('../models');

async function submitOrUpdateRating(userId, storeId, ratingValue) {
  let rating = await Rating.findOne({ where: { userId, storeId } });
  if (rating) {
    rating.rating = ratingValue;
    return await rating.save();
  } else {
    return await Rating.create({ userId, storeId, rating: ratingValue });
  }
}

async function getUserRating(userId, storeId) {
  return await Rating.findOne({ where: { userId, storeId } });
}

async function getRatingsByStore(storeId) {
  return await Rating.findAll({ where: { storeId } });
}

module.exports = {
  submitOrUpdateRating,
  getUserRating,
  getRatingsByStore,
};
