module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        telegramId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING,
            defaultValue: "Noma'lum"
        },

        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },{
        tableName: 'users',
        freezeTableName: true
    });

    return Users;
}