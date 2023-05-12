module.exports = (sequelize, DataTypes) => {
    const Phones = sequelize.define('Phones', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },
        
        user_id: DataTypes.INTEGER,

        phone: {
            type: DataTypes.STRING
        }
    },{
        tableName: 'phones',
        freezeTableName: true
    })

    return Phones;
}