const path = require('path');

module.exports = {
  development: {
    dialect: 'postgres',
    protocol: 'postgres',
    define: {
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_ts',
      updatedAt: 'updated_ts',
    },
  },
  production: {
    dialect: 'postgres',
    protocol: 'postgres',
    define: {
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_ts',
      updatedAt: 'updated_ts',
    },
  },
};
