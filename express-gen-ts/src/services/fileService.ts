import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Директория для загрузки файлов
const uploadDir = path.join(__dirname, '../../uploads');

// Создаем директорию, если она не существует
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Сохраняет изображение из base64 строки
 * @param base64Image - строка base64 с изображением
 * @returns путь к сохраненному файлу
 */
export const saveBase64Image = (base64Image: string): string => {
  // Проверяем, что строка содержит данные base64
  if (!base64Image?.includes('base64')) {
    return '';
  }

  // Извлекаем MIME тип и данные
  const matches = /^data:([A-Za-z-+/]+);base64,(.+)$/.exec(base64Image);

  if (!matches || matches.length !== 3) {
    return '';
  }

  const type = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, 'base64');

  // Определяем расширение файла на основе MIME типа
  let extension = '';
  switch (type) {
  case 'image/jpeg':
  case 'image/jpg':
    extension = '.jpg';
    break;
  case 'image/png':
    extension = '.png';
    break;
  default:
    extension = '.jpg'; // По умолчанию используем jpg
  }

  // Генерируем уникальное имя файла
  const fileName = `${uuidv4()}${extension}`;
  const filePath = path.join(uploadDir, fileName);

  // Записываем файл
  fs.writeFileSync(filePath, buffer);

  // Возвращаем относительный путь к файлу
  return `/uploads/${fileName}`;
};
