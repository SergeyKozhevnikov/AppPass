"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = require("./config/database");
const passRoutes_1 = __importDefault(require("./routes/passRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const path_1 = __importDefault(require("path"));
const Paths_1 = __importDefault(require("./common/constants/Paths"));
require("module-alias/register");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use(Paths_1.default.Base.Api + Paths_1.default.Api.Passes, passRoutes_1.default);
app.use(Paths_1.default.Base.Api + Paths_1.default.Api.Users, userRoutes_1.default);
database_1.sequelize
    .authenticate()
    .then(() => {
    console.log('Соединение с базой данных PostgreSQL установлено успешно.');
    return database_1.sequelize.sync({ alter: true });
})
    .then(() => {
    console.log('Модели синхронизированы с базой данных PostgreSQL.');
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Ошибка при подключении к базе данных PostgreSQL:', err);
    process.exit(1);
});
app.use((err, req, res, next) => {
    console.error('Ошибка:', err);
    let message = 'Неизвестная ошибка';
    if (err instanceof Error) {
        message = err.message;
    }
    else if (typeof err === 'string') {
        message = err;
    }
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        error: process.env.NODE_ENV === 'development' ? message : undefined,
    });
});
process.on('uncaughtException', (error) => {
    console.error('Необработанное исключение:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанное отклонение промиса:', reason);
});
