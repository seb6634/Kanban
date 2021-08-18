const sequelize = require('../db');

const { Model, DataTypes } = require('sequelize');

class Tag extends Model { }

Tag.init({
    name: DataTypes.TEXT,
    color: DataTypes.TEXT
}, {
    sequelize,
    tableName: 'tag'
});

module.exports = Tag;