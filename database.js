const {Sequelize} = require ('sequelize')

module.exports = new Sequelize(
    "tg-bot",
    "postgres",
    "21032003",
    {
        host: '#',
        port: '#',
        dialect: 'postgres'
    }
)