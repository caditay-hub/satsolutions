import { DataTypes, Model, Optional } from "sequelize";

export interface ServiceRequestAttributes {
  id: number;
  serviceName: string;
  phone: string;
  description: string | null;
  status: 'pending' | 'done';
  statusReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRequestCreationAttributes extends Optional<ServiceRequestAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'> { }

export class ServiceRequest extends Model<ServiceRequestAttributes, ServiceRequestCreationAttributes> implements ServiceRequestAttributes {
  declare id: number;
  declare serviceName: string;
  declare phone: string;
  declare description: string | null;
  declare status: 'pending' | 'done';
  declare statusReason: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initServiceRequest(sequelize: any) {
  ServiceRequest.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'done'),
        allowNull: false,
        defaultValue: 'pending',
      },
      statusReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ServiceRequest',
      tableName: 'service_requests',
      timestamps: true,
    }
  );
}
