const sequelize = require('../db');

const { Model, DataTypes } = require('sequelize');

class List extends Model { }

List.init({
    name: DataTypes.TEXT,
    position: DataTypes.INTEGER
}, {
    sequelize,
    tableName: 'list'
});

module.exports = List;