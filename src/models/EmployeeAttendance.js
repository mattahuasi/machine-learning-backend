import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Employee } from "./User.js";

export const EmployeeAttendance = sequelize.define("employeeAttendances", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  entryHour: {
    type: DataTypes.TIME,
  },
  exitHour: {
    type: DataTypes.TIME,
  },
  day: {
    type: DataTypes.DATEONLY,
  },

  // *Solo se permiten "onTime" y "late"
  punctuality: {
    type: DataTypes.STRING,
  },
});

Employee.hasMany(EmployeeAttendance, {
  foreignKey: "employeeId",
  sourceKey: "id",
});

EmployeeAttendance.belongsTo(Employee, {
  foreignKey: "employeeAttendanceId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});
