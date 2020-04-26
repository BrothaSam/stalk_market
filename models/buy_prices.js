module.exports = (sequelize, DataTypes) => {
    const BuyPrice = sequelize.define('buy_prices', {
      author_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return BuyPrice;
  };
  