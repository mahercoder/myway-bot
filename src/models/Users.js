module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },

        fullname: {
            type: DataTypes.STRING,
            defaultValue: "Noma'lum"
        },
        
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },

        referals: {
            type: DataTypes.STRING,
            defaultValue: '',
            allowNull: false
        },

        language_code: {
            type: DataTypes.STRING,
            defaultValue: 'uz'
        }
    },{
        tableName: 'users',
        freezeTableName: true
    });

    return Users;
}