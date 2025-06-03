// eslint-disable-next-line n/no-extraneous-import
import { Model, DataTypes, type Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Интерфейс для атрибутов Pass
interface PassAttributes {
  id: number;
  pass_type?: number;
  date_created?: Date;
  date_modified?: Date;
  status_id?: number;
  author_id?: number;
  photo?: string;
  fullName: string;
  phone: string;
  organization: string;
  email: string;
  birthDate: Date;
  hasCar: string;
  justification: string;
  startDate: Date;
  endDate: Date;
}

// Интерфейс для создания нового Pass (id может быть опциональным)
type PassCreationAttributes = Optional<PassAttributes, 'id' | 'date_created' | 'date_modified'>;

// Определение модели Pass
class Pass extends Model<PassAttributes, PassCreationAttributes> implements PassAttributes {
  public id!: number;
  public pass_type?: number;
  public date_created!: Date;
  public date_modified?: Date;
  public status_id?: number;
  public author_id?: number;
  public photo?: string;
  public fullName!: string;
  public phone!: string;
  public organization!: string;
  public email!: string;
  public birthDate!: Date;
  public hasCar!: string;
  public justification!: string;
  public startDate!: Date;
  public endDate!: Date;
}

Pass.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pass_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false, // false, чтобы поле было обязательным
      defaultValue: DataTypes.NOW, // Автоматически устанавливается текущее время при создании
    },
    date_modified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    organization: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hasCar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    justification: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'passes',
    modelName: 'Pass',
    timestamps: false, // Отключаем автоматические timestamps Sequelize
    // hooks для автоматического обновления timestamp-полей
    hooks: {
      beforeCreate: (pass: Pass) => {
        pass.date_created = new Date();
      },
      beforeUpdate: (pass: Pass) => {
        pass.date_modified = new Date();
      },
    },
  },
);

export default Pass;
