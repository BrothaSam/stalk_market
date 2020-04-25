module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define('prices', {
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

  return Price;
};
