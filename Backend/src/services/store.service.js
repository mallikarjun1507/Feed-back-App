const { Store, Rating, User } = require('../models');
const { Sequelize } = require('sequelize');

async function createStore(data) {
  return await Store.create(data);
}

async function getAllStores(filters) {
  return await Store.findAll({ where: filters });
}

async function getStoreWithRatings(storeId) {
  return await Store.findByPk(storeId, {
    include: [
      { model: Rating, include: [{ model: User, attributes: ['id','name','email'] }] }
    ]
  });
}

async function getAverageRating(storeId) {
  const avg = await Rating.findOne({
    where: { storeId },
    attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']]
  });
  return avg?.dataValues?.avgRating || 0;
}

module.exports = {
  createStore,
  getAllStores,
  getStoreWithRatings,
  getAverageRating,
};
