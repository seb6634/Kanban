const sequelize = require('../db');

const { Model, DataTypes } = require('sequelize');

class Card extends Model { }

Card.init({
    content: DataTypes.TEXT,
    color: DataTypes.TEXT,
    position: DataTypes.INTEGER
}, {
    sequelize,
    tableName: 'card'
});

module.exports = Card;