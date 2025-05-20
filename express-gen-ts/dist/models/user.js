"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Пользователь',
        validate: {
            isIn: [['Пользователь', 'Администратор']],
        },
    },
    tabNum: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: (0, sequelize_1.literal)('nextval("users_tab_num_seq")'),
    },
    surname: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    patronymic: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    pos: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    department: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    login: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    phoneNum: {
        type: sequelize_1.DataTypes.STRING(10),
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'users',
    modelName: 'User',
    hooks: {
        beforeCreate: (user) => {
            user.createdAt = new Date();
        },
        beforeUpdate: (user) => {
            user.updatedAt = new Date();
        },
    },
});
database_1.sequelize.beforeSync(async () => {
    await database_1.sequelize.query('CREATE SEQUENCE IF NOT EXISTS users_tab_num_seq');
});
exports.default = User;
