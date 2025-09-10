const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define(
    'Store',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: true },
      address: { type: DataTypes.STRING(400), allowNull: true },
      owner_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'stores',
      timestamps: true,
      underscored: true,
    }
  );

  Store.associate = (models) => {
    Store.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    Store.hasMany(models.Rating, { foreignKey: 'store_id', as: 'ratings' });
    Store.hasMany(models.User, { foreignKey: 'store_id', as: 'users' });
  };

  return Store;
};
