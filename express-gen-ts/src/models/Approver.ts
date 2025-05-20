// eslint-disable-next-line n/no-extraneous-import
import { Model, DataTypes, type Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Pass from './Pass';

// Интерфейс для атрибутов Approver
interface ApproverAttributes {
  id: number;
  pass_id: number;
  fullname: string;
  login: string;
  position: string;
  status_id?: number;
}

// Интерфейс для создания нового Approver (id может быть опциональным)
type ApproverCreationAttributes = Optional<ApproverAttributes, 'id'>;

// Определение модели Approver
class Approver
  extends Model<ApproverAttributes, ApproverCreationAttributes>
  implements ApproverAttributes
{
  public id!: number;
  public pass_id!: number;
  public fullname!: string;
  public login!: string;
  public position!: string;
  public status_id!: number;
}

Approver.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      // Явно указываем, что это SERIAL для PostgreSQL
      autoIncrementIdentity: true,
    },
    pass_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pass,
        key: 'id',
      },
    },
    fullname: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    position: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pass_statuses',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'approvers',
    modelName: 'Approver',
  }
);

// Определение отношений между моделями
Pass.hasMany(Approver, { foreignKey: 'pass_id', as: 'approvers' });
Approver.belongsTo(Pass, { foreignKey: 'pass_id' });

export default Approver;
