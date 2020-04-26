module.exports = (sequelize, DataTypes) => {
  const UserSettings = sequelize.define('user_settings', {
    author_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    timezone: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    allow_visitors: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  });

  return UserSettings;
};
