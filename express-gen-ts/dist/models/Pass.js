"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Pass extends sequelize_1.Model {
}
Pass.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pass_type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    date_modified: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    status_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    author_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    photo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    fullName: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    organization: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    birthDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    hasCar: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    justification: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    startDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'passes',
    modelName: 'Pass',
    timestamps: false,
    hooks: {
        beforeCreate: (pass) => {
            pass.date_created = new Date();
        },
        beforeUpdate: (pass) => {
            pass.date_modified = new Date();
        },
    },
});
exports.default = Pass;
