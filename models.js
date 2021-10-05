const db = require('./database')
const {DataTypes} = require('sequelize')
const { defaults } = require('pg')

const User = db.define('user',{
    id: {type: DataTypes.INTEGER,primaryKey: true,unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING,unique: true},
    right: {type: DataTypes.INTEGER, defaultValue: 0},
    wrong: {type: DataTypes.INTEGER, defaultValue: 0}
})

module.exports = User;