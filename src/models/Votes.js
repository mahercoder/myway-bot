module.exports = (sequelize, DataTypes) => {
    const Votes = sequelize.define('Votes', {
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
        tableName: 'votes',
        freezeTableName: true
    });

    return Votes;
}