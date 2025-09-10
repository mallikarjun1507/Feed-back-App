const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rating = sequelize.define(
    'Rating',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: { type: DataTypes.STRING(1000) },
    },
    {
      tableName: 'ratings',
      timestamps: true,
      underscored: true,
      indexes: [{ unique: true, fields: ['user_id', 'store_id'] }],
    }
  );

  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Rating.belongsTo(models.Store, { foreignKey: 'store_id', as: 'store' });
  };

  return Rating;
};
