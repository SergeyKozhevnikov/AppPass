"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePass = exports.updatePass = exports.getPassById = exports.getAllPasses = exports.createPass = void 0;
const Pass_1 = __importDefault(require("../models/Pass"));
const Approver_1 = __importDefault(require("../models/Approver"));
const fileService_1 = require("../services/fileService");
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
const createPass = async (req, res) => {
    let transaction;
    try {
        console.log('Получены данные:', req.body);
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
        transaction = await database_1.sequelize.transaction();
        try {
            let photoPath = '';
            if (passData.photo) {
                photoPath = (0, fileService_1.saveBase64Image)(passData.photo);
            }
            const now = new Date();
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
                status_id: 0,
                pass_type: 0,
                author_id: 1,
                date_created: now,
                date_modified: now,
            }, { transaction });
            if (passData.approvers && passData.approvers.length > 0) {
                const approverPromises = passData.approvers.map((approver, index) => {
                    return Approver_1.default.create({
                        pass_id: pass.id,
                        fullname: approver.name,
                        login: approver.login || `user${index + 1}`,
                        position: approver.position,
                        status_id: approver.status_id || 2,
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
const getAllPasses = async (_req, res) => {
    try {
        const passes = await Pass_1.default.findAll({
            include: [
                {
                    model: Approver_1.default,
                    as: 'approvers',
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
        const pass = await Pass_1.default.findByPk(id, {
            include: [
                {
                    model: Approver_1.default,
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
        const pass = await Pass_1.default.findByPk(id);
        if (!pass) {
            res.status(404).json({
                success: false,
                message: 'Пропуск не найден',
                error: `Пропуск с ID ${id} не существует`,
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
            const now = new Date();
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
                date_modified: now,
            }, { transaction });
            if (passData.approvers && passData.approvers.length > 0) {
                await Approver_1.default.destroy({
                    where: { pass_id: pass.id },
                    transaction,
                });
                const approverPromises = passData.approvers.map((approver, index) => {
                    return Approver_1.default.create({
                        pass_id: pass.id,
                        fullname: approver.name,
                        login: `user${index + 1}`,
                        position: approver.position,
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
        const pass = await Pass_1.default.findByPk(id);
        if (!pass) {
            res.status(404).json({
                success: false,
                message: 'Пропуск не найден',
                error: `Пропуск с ID ${id} не существует`,
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
