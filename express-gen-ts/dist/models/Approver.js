"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Pass_1 = __importDefault(require("./Pass"));
const user_1 = __importDefault(require("./user"));
class Approver extends sequelize_1.Model {
}
Approver.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pass_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pass_1.default,
            key: 'id',
        },
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_1.default,
            key: 'id',
        },
    },
    fullname: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    login: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    position: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'pass_statuses',
            key: 'id',
        },
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'approvers',
    modelName: 'Approver',
    timestamps: false,
});
Pass_1.default.hasMany(Approver, { foreignKey: 'pass_id', as: 'approvers' });
Approver.belongsTo(Pass_1.default, { foreignKey: 'pass_id' });
user_1.default.hasMany(Approver, { foreignKey: 'user_id', as: 'approvals' });
Approver.belongsTo(user_1.default, { foreignKey: 'user_id' });
exports.default = Approver;
