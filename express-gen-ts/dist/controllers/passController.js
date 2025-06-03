"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePass = exports.updatePass = exports.getPassById = exports.getAllPasses = exports.createPass = void 0;
const Pass_1 = __importDefault(require("../models/Pass"));
const Approver_1 = __importDefault(require("../models/Approver"));
const user_1 = __importDefault(require("../models/user"));
const fileService_1 = require("../services/fileService");
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
async function getGuestPassTypeId() {
    try {
        const result = await database_1.sequelize.query('SELECT id FROM pass_types WHERE name = \'Гостевой\' LIMIT 1', {
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (result && result.length > 0) {
            return result[0].id;
        }
        console.warn('Тип пропуска \'Гостевой\' не найден, используется ID = 1');
        return 1;
    }
    catch (error) {
        console.error('Ошибка при получении ID типа пропуска:', error);
        return 1;
    }
}
async function getWaitingStatusId() {
    try {
        const result = await database_1.sequelize.query('SELECT id FROM pass_statuses WHERE name = \'Ожидается\' LIMIT 1', {
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (result && result.length > 0) {
            return result[0].id;
        }
        console.warn('Статус \'Ожидается\' не найден, используется ID = 1');
        return 1;
    }
    catch (error) {
        console.error('Ошибка при получении ID статуса:', error);
        return 1;
    }
}
async function getOnApprovalStatusId() {
    try {
        const result = await database_1.sequelize.query('SELECT id FROM pass_statuses WHERE name = \'На согласовании\' LIMIT 1', {
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (result && result.length > 0) {
            return result[0].id;
        }
        console.warn('Статус \'На согласовании\' не найден, используется ID = 2');
        return 2;
    }
    catch (error) {
        console.error('Ошибка при получении ID статуса:', error);
        return 2;
    }
}
const createPass = async (req, res) => {
    let transaction;
    try {
        console.log('Получены данные:', req.body);
        const userId = req.user?.id ?? 1;
        console.log(`Используем ID пользователя из сессии: ${userId}`);
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({
                success: false,
                message: 'Отсутствуют данные для создания пропуска',
            });
            return;
        }
        const passData = req.body;
        if (!passData.fullName ||
            !passData.phone ||
            !passData.organization ||
            !passData.email) {
            res.status(400).json({
                success: false,
                message: 'Не заполнены обязательные поля',
            });
            return;
        }
        const existingPass = await Pass_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ phone: passData.phone }, { email: passData.email }],
            },
        });
        if (existingPass) {
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
        const guestPassTypeId = await getGuestPassTypeId();
        const waitingStatusId = await getWaitingStatusId();
        const onApprovalStatusId = await getOnApprovalStatusId();
        console.log('Используемые ID:', {
            guestPassTypeId,
            waitingStatusId,
            onApprovalStatusId,
        });
        transaction = await database_1.sequelize.transaction();
        try {
            let photoPath = '';
            if (passData.photo) {
                photoPath = (0, fileService_1.saveBase64Image)(passData.photo);
            }
            const pass = await Pass_1.default.create({
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
                status_id: waitingStatusId,
                pass_type: guestPassTypeId,
                author_id: userId,
            }, { transaction });
            console.log('Создан пропуск с ID:', pass.id);
            if (passData.approvers && passData.approvers.length > 0) {
                const approverPromises = passData.approvers.map(async (approver) => {
                    const user = await user_1.default.findByPk(approver.user_id, { transaction });
                    if (!user) {
                        throw new Error(`Пользователь с ID ${approver.user_id} не найден`);
                    }
                    return Approver_1.default.create({
                        pass_id: pass.id,
                        user_id: approver.user_id,
                        fullname: `${user.surname} ${user.name}${user.patronymic ? ' ' + user.patronymic : ''}`,
                        login: user.login,
                        position: user.pos ?? approver.position,
                        status_id: approver.status_id ?? onApprovalStatusId,
                    }, { transaction });
                });
                await Promise.all(approverPromises);
            }
            await transaction.commit();
            res.status(201).json({
                success: true,
                message: 'Пропуск успешно создан',
                data: {
                    id: pass.id,
                    date_created: pass.date_created,
                },
            });
        }
        catch (error) {
            if (transaction)
                await transaction.rollback();
            console.error('Ошибка при создании пропуска:', error);
            let errorMessage = 'Ошибка при создании пропуска';
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
                message: 'Ошибка при создании пропуска',
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
exports.createPass = createPass;
const getAllPasses = async (req, res) => {
    try {
        const userId = req.user?.id;
        let whereClause = {};
        if (userId && req.user?.role !== 'admin') {
            whereClause = { author_id: userId };
        }
        const passes = await Pass_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: Approver_1.default,
                    as: 'approvers',
                    include: [
                        {
                            model: user_1.default,
                            attributes: ['id', 'login', 'surname', 'name', 'patronymic', 'pos'],
                        },
                    ],
                },
            ],
            order: [['date_created', 'DESC']],
        });
        res.status(200).json({
            success: true,
            data: passes,
        });
    }
    catch (error) {
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
exports.getAllPasses = getAllPasses;
const getPassById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const pass = await Pass_1.default.findByPk(id, {
            include: [
                {
                    model: Approver_1.default,
                    as: 'approvers',
                    include: [
                        {
                            model: user_1.default,
                            attributes: ['id', 'login', 'surname', 'name', 'patronymic', 'pos'],
                        },
                    ],
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
        if (userId && req.user?.role !== 'admin' && pass.author_id !== userId) {
            res.status(403).json({
                success: false,
                message: 'Доступ запрещен',
                error: 'У вас нет прав для просмотра этого пропуска',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: pass,
        });
    }
    catch (error) {
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
exports.getPassById = getPassById;
const updatePass = async (req, res) => {
    let transaction;
    try {
        const { id } = req.params;
        const passData = req.body;
        const userId = req.user?.id;
        const pass = await Pass_1.default.findByPk(id);
        if (!pass) {
            res.status(404).json({
                success: false,
                message: 'Пропуск не найден',
                error: `Пропуск с ID ${id} не существует`,
            });
            return;
        }
        if (userId && req.user?.role !== 'admin' && pass.author_id !== userId) {
            res.status(403).json({
                success: false,
                message: 'Доступ запрещен',
                error: 'У вас нет прав для обновления этого пропуска',
            });
            return;
        }
        const existingPass = await Pass_1.default.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    { id: { [sequelize_1.Op.ne]: Number(id) } },
                    {
                        [sequelize_1.Op.or]: [{ phone: passData.phone }, { email: passData.email }],
                    },
                ],
            },
        });
        if (existingPass) {
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
        const waitingStatusId = await getWaitingStatusId();
        transaction = await database_1.sequelize.transaction();
        try {
            let photoPath = pass.photo ?? '';
            if (passData.photo && passData.photo !== pass.photo) {
                if (passData.photo.startsWith('data:image')) {
                    photoPath = (0, fileService_1.saveBase64Image)(passData.photo);
                }
                else {
                    photoPath = passData.photo;
                }
            }
            await pass.update({
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
            }, { transaction });
            if (passData.approvers && passData.approvers.length > 0) {
                await Approver_1.default.destroy({
                    where: { pass_id: pass.id },
                    transaction,
                });
                const approverPromises = passData.approvers.map(async (approver) => {
                    const user = await user_1.default.findByPk(approver.user_id, { transaction });
                    if (!user) {
                        throw new Error(`Пользователь с ID ${approver.user_id} не найден`);
                    }
                    return Approver_1.default.create({
                        pass_id: pass.id,
                        user_id: approver.user_id,
                        fullname: `${user.surname} ${user.name}${user.patronymic ? ' ' + user.patronymic : ''}`,
                        login: user.login,
                        position: user.pos ?? approver.position,
                        status_id: approver.status_id ?? waitingStatusId,
                    }, { transaction });
                });
                await Promise.all(approverPromises);
            }
            await transaction.commit();
            res.status(200).json({
                success: true,
                message: 'Пропуск успешно обновлен',
                data: {
                    id: pass.id,
                    date_modified: pass.date_modified,
                },
            });
        }
        catch (error) {
            if (transaction)
                await transaction.rollback();
            console.error('Ошибка при обновлении пропуска:', error);
            let errorMessage = 'Ошибка при обновлении пропуска';
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
                message: 'Ошибка при обновлении пропуска',
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
exports.updatePass = updatePass;
const deletePass = async (req, res) => {
    let transaction;
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const pass = await Pass_1.default.findByPk(id);
        if (!pass) {
            res.status(404).json({
                success: false,
                message: 'Пропуск не найден',
                error: `Пропуск с ID ${id} не существует`,
            });
            return;
        }
        if (userId && req.user?.role !== 'admin' && pass.author_id !== userId) {
            res.status(403).json({
                success: false,
                message: 'Доступ запрещен',
                error: 'У вас нет прав для удаления этого пропуска',
            });
            return;
        }
        transaction = await database_1.sequelize.transaction();
        try {
            await Approver_1.default.destroy({
                where: { pass_id: pass.id },
                transaction,
            });
            await pass.destroy({ transaction });
            await transaction.commit();
            res.status(200).json({
                success: true,
                message: 'Пропуск успешно удален',
            });
        }
        catch (error) {
            if (transaction)
                await transaction.rollback();
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
exports.deletePass = deletePass;
