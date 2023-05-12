module.exports = (sequelize, DataTypes) => {
    const Myland = sequelize.define('Myland', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        
        fullname: DataTypes.STRING,
        
        phone_number: DataTypes.STRING,
        
        votedAt: DataTypes.STRING

    },{
        tableName: 'myland',
        freezeTableName: true
    });

    return Myland;
}