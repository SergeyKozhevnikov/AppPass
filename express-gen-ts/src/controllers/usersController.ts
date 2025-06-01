import type { Request, Response } from 'express';
import { sequelize } from '../config/database';
// eslint-disable-next-line n/no-extraneous-import
import { Transaction } from 'sequelize';
import User from '../models/user';

// Текущая дата и время для timestamp-полей
const now = new Date();

interface ILogPass { login: string; password: string }

// Интерфейс пользователя
interface IUserProfile {
  id: number;
  role: string;
  tabNum: number;
  surname: string;
  name: string;
  patronymic: string;
  pos?: string;
  department?: string;
  login: string;
  email: string;
  password: string;
  phoneNum?: string;
}

// Получает пользователей
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);

    let errorMessage = 'Ошибка при получении списка пользователей';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка пользователей',
      error: errorMessage,
    });
  }
};

/**
 * Получает список всех активных пользователей
 */
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.findAll({
      order: [
        ['surname', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);

    let errorMessage = 'Ошибка при получении списка пользователей';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка пользователей',
      error: errorMessage,
    });
  }
};

// Получает пользователя (по Id)
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        error: `Пользователь с id: ${id} не существует`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);

    let errorMessage = 'Ошибка при получении пользователя';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка при получении пользователя',
      error: errorMessage,
    });
  }
};

// Получает пользователя (по логину)
export const getUserByLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { login, password }: ILogPass = req.body as ILogPass;
    const user = await User.findOne({ where: { login: login } });
    let userWithoutPassword;

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        error: `Пользователь с логином: ${login} не существует`,
      });
      return;
    }

    if (password !== user.password) {
      res.status(404).json({
        success: false,
        message: 'Неверный логин или пароль',
      });
    } else if (password === user.password) {
      // const {password, ...other} = user
      // userWithoutPassword = other
      userWithoutPassword = {
        id: user.id,
        role: user.role,
        tabNum: user.tabNum,
        surname: user.surname,
        name: user.name,
        patronymic: user.patronymic,
        pos: user.pos,
        department: user.department,
        login: user.login,
        email: user.email,
        phoneNum: user.phoneNum,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }

    res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);

    let errorMessage = 'Ошибка при получении пользователя';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: 'Ошибка при получении пользователя',
      error: errorMessage,
    });
  }
};

// Создаёт пользователя
export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Создаем транзакцию перед любыми операциями с базой данных
  let transaction: Transaction | undefined;

  try {
    console.log('Получены данные:', req.body);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Отсутствуют данные для создания пользователя',
      });
    }

    const userData = req.body as IUserProfile;
    // Проверка обязательных полей
    if (
      !userData.surname ||
      !userData.name ||
      !userData.patronymic ||
      !userData.login ||
      !userData.password ||
      !userData.email
    ) {
      res.status(400).json({
        success: false,
        message: 'Не заполнены обязательные поля',
      });
    }

    // Начинаем транзакцию только после валидации данных
    transaction = await sequelize.transaction();

    try {
      // Создаем запись пользователя
      const user = await User.create(
        {
          id: undefined, // будет сгенерирован автоматически
          surname: userData.surname,
          name: userData.name,
          patronymic: userData.patronymic,
          login: userData.login,
          password: userData.password,
          email: userData.email,
          createdAt: now,
          updatedAt: now,
        },
        { transaction },
      );

      // Если все операции успешны, фиксируем пользователя
      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Пользователь успешно создан',
        data: {
          id: user.id,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      // Если произошла ошибка, откатываем
      if (transaction) await transaction.rollback();
      console.error('Ошибка при создании пользователя:', error);

      // Формируем детальное сообщение об ошибке
      let errorMessage = 'Ошибка при создании пользователя';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Проверяем тип ошибки для более информативного сообщения
        if (error.message.includes('violates foreign key constraint')) {
          errorMessage =
            'Ошибка связи с другими таблицами. Проверьте корректность указанных данных.';
        } else if (error.message.includes('violates not-null constraint')) {
          errorMessage =
            'Не заполнены обязательные поля. Пожалуйста, проверьте форму.';
        } else if (error.message.includes('duplicate key value')) {
          errorMessage = 'Запись с такими данными уже существует.';
        }
      }

      res.status(500).json({
        success: false,
        message: 'Ошибка при создании пользователя',
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

// Удаляет пользователя (по логину)
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Объявляем переменную для транзакции
  let transaction;

  try {
    const { id } = req.params;
    // Проверяем существование пользователя
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        error: `Пользователь с Id ${id} не существует`,
      });
      return;
    }

    // Создаем транзакцию только после успешной проверки
    transaction = await sequelize.transaction();

    try {
      // Удаляем пользователя
      await user.destroy({ transaction });

      // Если все операции успешны, фиксируем транзакцию
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: `Пользователь с Id ${id} успешно удален`,
      });
    } catch (error) {
      // Если произошла ошибка, откатываем транзакцию
      if (transaction) await transaction.rollback();

      console.error('Ошибка при удалении пользователя:', error);

      let errorMessage = 'Ошибка при удалении пользователя';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении пользователя',
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

// Изменяет информацию о пользователе
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Объявляем переменную для транзакции
  let transaction: Transaction | undefined;

  try {
    const { id } = req.params;
    const userData = req.body as IUserProfile;

    // Проверяем существование пользователя
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
        error: `Пользователь с Id ${id} не существует`,
      });
      return;
    }

    // Создаем транзакцию только после успешной проверки
    transaction = await sequelize.transaction();

    try {
      // Обновляем запись пользователя
      await user.update(
        {
          role: userData.role,
          tabNum: userData.tabNum,
          surname: userData.surname,
          name: userData.name,
          patronymic: userData.patronymic,
          login: userData.login,
          email: userData.email,
          pos: userData.pos,
          department: userData.department,
          password: userData.password,
          phoneNum: userData.phoneNum,
          updatedAt: now,
        },
        { transaction },
      );

      // Если все операции успешны, фиксируем транзакцию
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: 'Пользователь успешно обновлен',
        data: {
          id: user.id,
          userData: user,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      // Если произошла ошибка, откатываем транзакцию
      if (transaction) await transaction.rollback();

      console.error('Ошибка при обновлении пользователя:', error);

      let errorMessage = 'Ошибка при обновлении пользователя';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Проверяем тип ошибки для более информативного сообщения
        if (error.message.includes('violates foreign key constraint')) {
          errorMessage =
            'Ошибка связи с другими таблицами. Проверьте корректность указанных данных.';
        } else if (error.message.includes('violates not-null constraint')) {
          errorMessage =
            'Не заполнены обязательные поля. Пожалуйста, проверьте форму.';
        }
      }

      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении пользователя',
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
