"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const env = dotenv_1.default.config().parsed ?? {};
if (!env.DB_NAME || !env.DB_USER || !env.DB_PASSWORD || !env.DB_HOST || !env.DB_PORT) {
    throw new Error('Отсутствует файл .env');
}
const dbName = env.DB_NAME;
const dbUser = env.DB_USER;
const dbPassword = env.DB_PASSWORD;
const dbHost = env.DB_HOST;
const dbPort = parseInt(env.DB_PORT, 10);
exports.sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: console.log,
    define: {
        timestamps: false,
        freezeTableName: true,
    },
});
