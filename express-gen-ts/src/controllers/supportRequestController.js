"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupportRequest = void 0;
const database_1 = require("../config/database");
const SupportRequest_1 = __importDefault(require("../models/SupportRequest"));
const createSupportRequest = async (req, res) => {
  let transaction;
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Пользователь не авторизован',
      });
      return;
    }
    const { problem, email, phone_num, content } = req.body;
    if (!problem || !email || !phone_num || !content) {
      res.status(400).json({
        success: false,
        message: 'Не заполнены обязательные поля',
      });
      return;
    }
    transaction = await database_1.sequelize.transaction();
    const newRequest = await SupportRequest_1.default.create({
      user_id: userId,
      status_id: 1,
      problem,
      email,
      phone_num,
      content,
    }, { transaction });
    await transaction.commit();
    res.status(201).json({
      success: true,
      message: 'Заявка успешно создана',
      data: newRequest,
    });
  }
  catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Ошибка при создании заявки в поддержку:', error);
    let errorMessage = 'Ошибка при создании заявки';
    if (error instanceof Error) {
      if (error.message.includes('violates foreign key constraint')) {
        errorMessage = 'Ошибка связи с другими таблицами. Проверьте корректность данных.';
      }
      else if (error.message.includes('violates not-null constraint')) {
        errorMessage = 'Не заполнены обязательные поля. Пожалуйста, проверьте форму.';
      }
      else if (error.message.includes('duplicate key value')) {
        errorMessage = 'Заявка с такими данными уже существует.';
      }
      else {
        errorMessage = error.message;
      }
    }
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании заявки',
      error: errorMessage,
    });
  }
};
exports.createSupportRequest = createSupportRequest;
