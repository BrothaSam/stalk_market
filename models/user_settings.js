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
    });
  
    return UserSettings;
  };
  