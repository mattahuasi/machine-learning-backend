import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  ci: {
    type: DataTypes.STRING,
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
  },
  phone: {
    type: DataTypes.STRING,
  },
  inside: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export const Employee = sequelize.define("employees", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 1,
  },
  staff: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
});

User.hasOne(Employee, {
  foreignKey: "userId",
  sourceKey: "id",
});

Employee.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});
