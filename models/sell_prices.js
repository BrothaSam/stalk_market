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
  });

  return SellPrice;
};
