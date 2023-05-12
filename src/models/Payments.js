module.exports = (sequelize, DataTypes) => {
    const Payments = sequelize.define('Payments', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        
        cost: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },

        card: { 
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },

        isPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'payments',
        freezeTableName: true
    });

    return Payments;
}