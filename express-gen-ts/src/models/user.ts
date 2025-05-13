// eslint-disable-next-line n/no-extraneous-import
import { Model, DataTypes, type Optional, literal } from 'sequelize';
import { sequelize } from '../config/database';

// Интерфейс для атрибутов User
interface IUserAttributes {
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
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания нового User и опциональные поля
type TUserCreationAttributes = Optional<
  IUserAttributes,
  'id' | 'role' | 'tabNum' | 'createdAt' | 'updatedAt'
>;

// Определение модели User
class User
  extends Model<IUserAttributes, TUserCreationAttributes>
  implements IUserAttributes
{
  public id!: number;
  public role!: string;
  public tabNum!: number;
  public surname!: string;
  public name!: string;
  public patronymic!: string;
  public pos?: string;
  public department?: string;
  public login!: string;
  public email!: string;
  public password!: string;
  public phoneNum?: string;
  public createdAt!: Date;
  public updatedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true, // явно указываем SERIAL для PostgreSQL
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Пользователь',
      validate: {
        isIn: [['Пользователь', 'Администратор']],
      },
    },
    tabNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: literal("nextval('users_tab_num_seq')"),
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    patronymic: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pos: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(255),
      // allowNull по умолчанию true
    },
    login: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phoneNum: {
      type: DataTypes.STRING(10),
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    // hooks для автоматического обновления timestamp-полей
    hooks: {
      beforeCreate: (user: User) => {
        user.createdAt = new Date();
      },
      beforeUpdate: (user: User) => {
        user.updatedAt = new Date();
      },
    },
  }
);

sequelize.beforeSync(async () => {
  await sequelize.query('CREATE SEQUENCE IF NOT EXISTS users_tab_num_seq');
});

export default User;
