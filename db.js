import {Sequelize} from 'sequelize'

export default new Sequelize(
    process.env.DBNAME,
    process.env.DBUSER,
    process.env.DBPASS,
    {
        dialect: "postgres",
        host: process.env.DBHOST,
        port: process.env.DBPORT,
    }
)