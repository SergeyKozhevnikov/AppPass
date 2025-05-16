import type { Request, Response } from 'express';
import Pass from '../models/Pass';
import Approver from '../models/Approver';
import { saveBase64Image } from '../services/fileService';
import { sequelize } from '../config/database';
// eslint-disable-next-line n/no-extraneous-import
import { Transaction } from 'sequelize';
import { Op } from 'sequelize';

// Интерфейс для данных пропуска
interface PassData {
  fullName: string;
  phone: string;
  organization: string;
  email: string;
  birthDate: string;
  hasCar: string;
  justification: string;
  startDate: string;
  endDate: string;
  photo?: string;
  approvers: {
    id?: number
    name: string
    position: string
    login?: string
    status_id?: number
  }[];
}

/**
 * Создает новый пропуск
 */
export const createPass = async (req: Request, res: Response): Promise<void> => {
  // Создаем транзакцию перед любыми операциями с базой данных
  let transaction: Transaction | undefined;

  try {
    console.log('Получены данные:', req.body);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Отсутствуют данные для создания пропуска',
      });
      return;
    }

    const passData = req.body as PassData;

    // Проверка обязательных полей
    if (!passData.fullName || !passData.phone || !passData.organization || !passData.email) {
      res.status(400).json({
        success: false,
        message: 'Не заполнены обязательные поля',
      });
      return;
    }

    // Проверка на уникальность телефона и email
    const existingPass = await Pass.findOne({
      where: {
        [Op.or]: [{ phone: passData.phone }, { email: passData.email }],
      },
    });

    if (existingPass) {
      // Определяем, какие именно данные дублируются
      const duplicateFields = [];

      if (existingPass.phone === passData.phone) {
        duplicateFields.push('телефоном');
      }

      if (existingPass.email === passData.email) {
        duplicateFields.push('почтовым адресом');
      }

      res.status(409).json({
        success: false,
        message: 'Дублирование данных',
        error: `В системе уже существует заявка с таким же ${duplicateFields.join(' и ')}. ID заявки: ${existingPass.id}`,
        duplicateFields: duplicateFields,
        existingPassId: existingPass.id,
      });
      return;
    }

    // Начинаем транзакцию только после валидации данных
    transaction = await sequelize.transaction();

    try {
      // Обработка фотографии, если она есть
      let photoPath = '';
      if (passData.photo) {
        photoPath = saveBase64Image(passData.photo);
      }

      // Текущая дата и время для timestamp-полей
      const now = new Date();

      // Создаем запись пропуска
      const pass = await Pass.create(
        {
          fullName: passData.fullName,
          phone: passData.phone,
          organization: passData.organization,
          email: passData.email,
          birthDate: new Date(passData.birthDate),
          hasCar: passData.hasCar,
          justification: passData.justification,
          startDate: new Date(passData.startDate),
          endDate: new Date(passData.endDate),
          photo: photoPath,
          status_id: 0,
          pass_type: 0,
          author_id: 1, // ID текущего пользователя (в реальном приложении получаем из сессии)
          date_created: now, // Явно устанавливаем дату создания
          date_modified: now, // При создании дата изменения равна дате создания
        },
        { transaction },
      );

      // Создаем записи согласующих
      if (passData.approvers && passData.approvers.length > 0) {
        const approverPromises = passData.approvers.map((approver, index) => {
          return Approver.create(
            {
              pass_id: pass.id,
              fullname: approver.name,
              login: approver.login || `user${index + 1}`, // Используем логин из данных или генерируем
              position: approver.position,
              status_id: approver.status_id || 2, // По умолчанию "На согласовании" при создании заявки
            },
            { transaction },
          );
        });

        await Promise.all(approverPromises);
      }

      // Если все операции успешны, фиксируем транзакцию
      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Пропуск успешно создан',
        data: {
          id: pass.id,
          date_created: pass.date_created,
        },
      });
    } catch (error) {
      // Если произошла ошибка, откатываем транзакцию
      if (transaction) await transaction.rollback();

      console.error('Ошибка при создании пропуска:', error);

      // Формируем детальное сообщение об ошибке
      let errorMessage = 'Ошибка при создании пропуска';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Проверяем тип ошибки для более информативного сообщения
        if (error.message.includes('violates foreign key constraint')) {
          errorMessage = 'Ошибка связи с другими таблицами. Проверьте корректность указанных данных.';
        } else if (error.message.includes('violates not-null constraint')) {
          errorMessage = 'Не заполнены обязательные поля. Пожалуйста, проверьте форму.';
        } else if (error.message.includes('duplicate key value')) {
          errorMessage = 'Запись с такими данными уже существует.';
        }
      }

      res.status(500).json({
        success: false,
        message: 'Ошибка при создании пропуска',
        error: errorMessage,
      });
    }
  } catch (error) {
    // Если произошла ошибка до начала транзакции
    console.error('Ошибка при обработке запроса:', error);

    let errorMessage = 'Внутренняя ошибка сервера';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: errorMessage,
    });
  }
};

/**
 * Получает список всех пропусков
 */
export const getAllPasses = async (_req: Request, res: Response) => {
  try {
    const passes = await Pass.findAll({
      include: [
        {
          model: Approver,
          as: 'approvers',
        },
      ],
      order: [['date_created', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: passes,
    });
  } catch (error) {
    console.error('Ошибка при получении списка пропусков:', error);

    let errorMessage = 'Ошибка при получении списка пропусков';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка пропусков',
      error: errorMessage,
    });
  }
};

/**
 * Получает пропуск по ID
 */
export const getPassById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const pass = await Pass.findByPk(id, {
      include: [
        {
          model: Approver,
          as: 'approvers',
        },
      ],
    });

    if (!pass) {
      res.status(404).json({
        success: false,
        message: 'Пропуск не найден',
        error: `Пропуск с ID ${id} не существует`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: pass,
    });
  } catch (error) {
    console.error('Ошибка при получении пропуска:', error);

    let errorMessage = 'Ошибка при получении пропуска';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка при получении пропуска',
      error: errorMessage,
    });
  }
};

/**
 * Обновляет пропуск
 */
export const updatePass = async (req: Request, res: Response): Promise<void> => {
  // Объявляем переменную для транзакции
  let transaction: Transaction | undefined;

  try {
    const { id } = req.params;
    const passData = req.body as PassData;

    // Проверяем существование пропуска
    const pass = await Pass.findByPk(id);

    if (!pass) {
      res.status(404).json({
        success: false,
        message: 'Пропуск не найден',
        error: `Пропуск с ID ${id} не существует`,
      });
      return;
    }

    // Проверка на уникальность телефона и email при обновлении
    // Исключаем текущий пропуск из проверки
    const existingPass = await Pass.findOne({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: Number(id) } }, // Исключаем текущий пропуск
          {
            [Op.or]: [{ phone: passData.phone }, { email: passData.email }],
          },
        ],
      },
    });

    if (existingPass) {
      // Определяем, какие именно данные дублируются
      const duplicateFields = [];

      if (existingPass.phone === passData.phone) {
        duplicateFields.push('телефон');
      }

      if (existingPass.email === passData.email) {
        duplicateFields.push('почтовый адрес');
      }

      res.status(409).json({
        success: false,
        message: 'Дублирование данных',
        error: `В системе уже существует заявка с таким же ${duplicateFields.join(' и ')}. ID заявки: ${existingPass.id}`,
        duplicateFields: duplicateFields,
        existingPassId: existingPass.id,
      });
      return;
    }

    // Создаем транзакцию только после успешной проверки
    transaction = await sequelize.transaction();

    try {
      // Обработка фотографии, если она изменилась
      let photoPath = pass.photo ?? '';
      if (passData.photo && passData.photo !== pass.photo) {
        if (passData.photo.startsWith('data:image')) {
          photoPath = saveBase64Image(passData.photo);
        } else {
          photoPath = passData.photo;
        }
      }

      // Текущая дата и время для timestamp-полей
      const now = new Date();

      // Обновляем запись пропуска
      await pass.update(
        {
          fullName: passData.fullName,
          phone: passData.phone,
          organization: passData.organization,
          email: passData.email,
          birthDate: new Date(passData.birthDate),
          hasCar: passData.hasCar,
          justification: passData.justification,
          startDate: new Date(passData.startDate),
          endDate: new Date(passData.endDate),
          photo: photoPath,
          date_modified: now,
        },
        { transaction },
      );

      // Обновляем согласующих
      if (passData.approvers && passData.approvers.length > 0) {
        // Удаляем существующих согласующих
        await Approver.destroy({
          where: { pass_id: pass.id },
          transaction,
        });

        // Создаем новых согласующих
        const approverPromises = passData.approvers.map((approver, index) => {
          return Approver.create(
            {
              pass_id: pass.id,
              fullname: approver.name,
              login: `user${index + 1}`,
              position: approver.position,
            },
            { transaction },
          );
        });

        await Promise.all(approverPromises);
      }

      // Если все операции успешны, фиксируем транзакцию
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: 'Пропуск успешно обновлен',
        data: {
          id: pass.id,
          date_modified: pass.date_modified,
        },
      });
    } catch (error) {
      // Если произошла ошибка, откатываем транзакцию
      if (transaction) await transaction.rollback();

      console.error('Ошибка при обновлении пропуска:', error);

      let errorMessage = 'Ошибка при обновлении пропуска';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Проверяем тип ошибки для более информативного сообщения
        if (error.message.includes('violates foreign key constraint')) {
          errorMessage = 'Ошибка связи с другими таблицами. Проверьте корректность указанных данных.';
        } else if (error.message.includes('violates not-null constraint')) {
          errorMessage = 'Не заполнены обязательные поля. Пожалуйста, проверьте форму.';
        }
      }

      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении пропуска',
        error: errorMessage,
      });
    }
  } catch (error) {
    // Если произошла ошибка до начала транзакции
    console.error('Ошибка при обработке запроса:', error);

    let errorMessage = 'Внутренняя ошибка сервера';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: errorMessage,
    });
  }
};

/**
 * Удаляет пропуск
 */
export const deletePass = async (req: Request, res: Response): Promise<void> => {
  // Объявляем переменную для транзакции
  let transaction;

  try {
    const { id } = req.params;

    // Проверяем существование пропуска
    const pass = await Pass.findByPk(id);

    if (!pass) {
      res.status(404).json({
        success: false,
        message: 'Пропуск не найден',
        error: `Пропуск с ID ${id} не существует`,
      });
      return;
    }

    // Создаем транзакцию только после успешной проверки
    transaction = await sequelize.transaction();

    try {
      // Удаляем связанных согласующих
      await Approver.destroy({
        where: { pass_id: pass.id },
        transaction,
      });

      // Удаляем пропуск
      await pass.destroy({ transaction });

      // Если все операции успешны, фиксируем транзакцию
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: 'Пропуск успешно удален',
      });
    } catch (error) {
      // Если произошла ошибка, откатываем транзакцию
      if (transaction) await transaction.rollback();

      console.error('Ошибка при удалении пропуска:', error);

      let errorMessage = 'Ошибка при удалении пропуска';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении пропуска',
        error: errorMessage,
      });
    }
  } catch (error) {
    // Если произошла ошибка до начала транзакции
    console.error('Ошибка при обработке запроса:', error);

    let errorMessage = 'Внутренняя ошибка сервера';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера',
      error: errorMessage,
    });
  }
};
