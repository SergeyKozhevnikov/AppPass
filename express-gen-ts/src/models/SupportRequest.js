"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const user_1 = __importDefault(require("./user"));
class SupportRequest extends sequelize_1.Model {
}
SupportRequest.init({
  id: {
    type: sequelize_1.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    autoIncrementIdentity: true,
  },
  user_id: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: user_1.default,
      key: 'id',
    },
  },
  status_id: {
    type: sequelize_1.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  problem: {
    type: sequelize_1.DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: sequelize_1.DataTypes.STRING(255),
    allowNull: false,
  },
  phone_num: {
    type: sequelize_1.DataTypes.STRING(50),
    allowNull: false,
  },
  content: {
    type: sequelize_1.DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize: database_1.sequelize,
  tableName: 'support_request',
  modelName: 'SupportRequest',
});
SupportRequest.belongsTo(user_1.default, { foreignKey: 'user_id' });
user_1.default.hasMany(SupportRequest, { foreignKey: 'user_id' });
exports.default = SupportRequest;