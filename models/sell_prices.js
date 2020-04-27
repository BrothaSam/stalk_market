module.exports = (sequelize, DataTypes) => {
  const SellPrice = sequelize.define('sell_prices', {
    author_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
    period: {
      type: DataTypes.STRING(2),
      primaryKey: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
/* 
  SellPrice.associate = function (models) {
    models.sell_prices.belongsTo(models.user_settings, {
      foreignKey: 'author_id',
    });
  }; */

  return SellPrice;
};
