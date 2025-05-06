// eslint-disable-next-line n/no-extraneous-import
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

const env = dotenv.config().parsed ?? {};

if (!env.DB_NAME || !env.DB_USER || !env.DB_PASSWORD || !env.DB_HOST || !env.DB_PORT) {
  throw new Error('Отсутствует файл .env');
}

// Данные для подключения к БД
const dbName = env.DB_NAME;
const dbUser = env.DB_USER;
const dbPassword = env.DB_PASSWORD;
const dbHost = env.DB_HOST;
const dbPort = parseInt(env.DB_PORT, 10);

// Создаем экземпляр Sequelize для PostgreSQL
export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: console.log,
  define: {
    // Автоматическое добавление полей createdAt и updatedAt
    timestamps: true,
    // Используем точное имя таблицы без преобразования во множественное число
    freezeTableName: true,
  },
});
