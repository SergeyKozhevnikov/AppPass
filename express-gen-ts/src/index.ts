import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { sequelize } from './config/database';
import passRoutes from './routes/passRoutes';
import userRoutes from './routes/userRoutes';
import path from 'path';
import Paths from './common/constants/Paths';

// Register module aliases
import 'module-alias/register';

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' })); // Увеличиваем лимит для передачи фото в base64
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Статические файлы для загруженных изображений
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Маршруты
app.use(Paths.Base.Api + Paths.Api.Passes, passRoutes);
app.use(Paths.Base.Api + Paths.Api.Users, userRoutes);

// Проверка соединения с базой данных и синхронизация моделей
sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение с базой данных PostgreSQL установлено успешно.');
    // Используем force: true только для первого запуска, чтобы пересоздать таблицы
    // В продакшене используем { force: false } или { alter: true }
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Модели синхронизированы с базой данных PostgreSQL.');
    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log('Лимит размера запроса: 50MB');
    });
  })
  .catch((err: unknown) => {
    console.error('Ошибка при подключении к базе данных PostgreSQL:', err);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1); // Завершаем процесс с ошибкой, если не удалось подключиться к БД
  });

// Обработка ошибок
app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line
    next: express.NextFunction,
  ) => {
    console.error('Ошибка:', err);

    let message = 'Неизвестная ошибка';
    let statusCode = 500;

    if (err instanceof Error) {
      message = err.message;

      if (err.message.includes('request entity too large') || err.message.includes('PayloadTooLargeError')) {
        message = 'Размер отправляемых данных слишком большой. Пожалуйста, уменьшите размер изображения.';
        statusCode = 413; // Payload Too Large
      }
    } else if (typeof err === 'string') {
      message = err;
    }

    res.status(statusCode).json({
      success: false,
      message: statusCode === 413 ? message : 'Внутренняя ошибка сервера',
      // eslint-disable-next-line n/no-process-env
      error: process.env.NODE_ENV === 'development' ? message : undefined,
    });
  },
);

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('Необработанное исключение:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
});

// Обработка необработанных отклонений промисов
// eslint-disable-next-line
process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанное отклонение промиса:', reason);
});
