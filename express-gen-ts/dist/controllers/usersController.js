"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = exports.getUserByLogin = exports.getUser = exports.getAllUsers = exports.getUsers = void 0;
const database_1 = require("../config/database");
const user_1 = __importDefault(require("../models/user"));
const now = new Date();
const getUsers = async (req, res) => {
    try {
        const users = await user_1.default.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
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
exports.getUsers = getUsers;
const getAllUsers = async (_req, res) => {
    try {
        const users = await user_1.default.findAll({
            order: [
                ['surname', 'ASC'],
                ['name', 'ASC'],
            ],
        });
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
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
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_1.default.findByPk(id);
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
    }
    catch (error) {
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
exports.getUser = getUser;
const getUserByLogin = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await user_1.default.findOne({ where: { login: login } });
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
        }
        else if (password === user.password) {
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
    }
    catch (error) {
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
exports.getUserByLogin = getUserByLogin;
const createUser = async (req, res) => {
    let transaction;
    try {
        console.log('Получены данные:', req.body);
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({
                success: false,
                message: 'Отсутствуют данные для создания пользователя',
            });
        }
        const userData = req.body;
        if (!userData.surname ||
            !userData.name ||
            !userData.patronymic ||
            !userData.login ||
            !userData.password ||
            !userData.email) {
            res.status(400).json({
                success: false,
                message: 'Не заполнены обязательные поля',
            });
        }
        transaction = await database_1.sequelize.transaction();
        try {
            const user = await user_1.default.create({
                id: undefined,
                surname: userData.surname,
                name: userData.name,
                patronymic: userData.patronymic,
                login: userData.login,
                password: userData.password,
                email: userData.email,
                createdAt: now,
                updatedAt: now,
            }, { transaction });
            await transaction.commit();
            res.status(201).json({
                success: true,
                message: 'Пользователь успешно создан',
                data: {
                    id: user.id,
                    createdAt: user.createdAt,
                },
            });
        }
        catch (error) {
            if (transaction)
                await transaction.rollback();
            console.error('Ошибка при создании пользователя:', error);
            let errorMessage = 'Ошибка при создании пользователя';
            if (error instanceof Error) {
                errorMessage = error.message;
                if (error.message.includes('violates foreign key constraint')) {
                    errorMessage =
                        'Ошибка связи с другими таблицами. Проверьте корректность указанных данных.';
                }
                else if (error.message.includes('violates not-null constraint')) {
                    errorMessage =
                        'Не заполнены обязательные поля. Пожалуйста, проверьте форму.';
                }
                else if (error.message.includes('duplicate key value')) {
                    errorMessage = 'Запись с такими данными уже существует.';
                }
            }
            res.status(500).json({
                success: false,
                message: 'Ошибка при создании пользователя',
                error: errorMessage,
            });
        }
    }
    catch (error) {
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
exports.createUser = createUser;
const deleteUser = async (req, res) => {
    let transaction;
    try {
        const { id } = req.params;
        const user = await user_1.default.findByPk(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Пользователь не найден',
                error: `Пользователь с Id ${id} не существует`,
            });
            return;
        }
        transaction = await database_1.sequelize.transaction();
        try {
            await user.destroy({ transaction });
            await transaction.commit();
            res.status(200).json({
                success: true,
                message: `Пользователь с Id ${id} успешно удален`,
            });
        }
        catch (error) {
            if (transaction)
                await transaction.rollback();
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
    }
    catch (error) {
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
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    let transaction;
    try {
        const { id } = req.params;
        const userData = req.body;
        const user = await user_1.default.findByPk(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Пользователь не найден',
                error: `Пользователь с Id ${id} не существует`,
            });
            return;
        }
        transaction = await database_1.sequelize.transaction();
        try {
            await user.update({
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
            }, { transaction });
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
        }
        catch (error) {
            if (transaction)
                await transaction.rollback();
            console.error('Ошибка при обновлении пользователя:', error);
            let errorMessage = 'Ошибка при обновлении пользователя';
            if (error instanceof Error) {
                errorMessage = error.message;
                if (error.message.includes('violates foreign key constraint')) {
                    errorMessage =
                        'Ошибка связи с другими таблицами. Проверьте корректность указанных данных.';
                }
                else if (error.message.includes('violates not-null constraint')) {
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
    }
    catch (error) {
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
exports.updateUser = updateUser;
