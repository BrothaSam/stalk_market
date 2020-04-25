const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/database.sqlite',
  define: {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_ts',
    updatedAt: 'updated_ts',
  },
});

console.log('here');

module.exports = sequelize;
