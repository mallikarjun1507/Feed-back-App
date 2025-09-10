const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const RoleModel = require('./role.model');
const UserModel = require('./user.model');
const StoreModel = require('./store.model');
const RatingModel = require('./rating.model');

// init models
const Role = RoleModel(sequelize);
const User = UserModel(sequelize);
const Store = StoreModel(sequelize);
const Rating = RatingModel(sequelize);

// associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

User.hasOne(Store, { foreignKey: 'owner_id' });
Store.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });

module.exports = { sequelize, Sequelize, Role, User, Store, Rating };
