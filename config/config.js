const path = require('path');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/database.sqlite'),
    define: {
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_ts',
      updatedAt: 'updated_ts',
    },
  },
  production: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/database.sqlite'),
    define: {
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_ts',
      updatedAt: 'updated_ts',
    },
  },
};
