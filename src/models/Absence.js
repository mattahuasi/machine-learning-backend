import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Employee } from "./User.js";

export const Absence = sequelize.define("absences", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  start: {
    type: DataTypes.DATEONLY,
  },
  end: {
    type: DataTypes.DATEONLY,
  },
  //Detalle de ausencia
  detail: {
    type: DataTypes.TEXT,
  },
  //Este campo se utiliza para almacenar cualquier documentación relacionada con la ausencia. Esto podría incluir un certificado médico, una carta de solicitud, u otra información relevante.
  documentation: {
    type: DataTypes.TEXT,
  },
});

export const AbsenceType = sequelize.define("absenceTypes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  detail: {
    type: DataTypes.STRING,
  },
});

// Define las relaciones
Absence.belongsTo(AbsenceType, {
  foreignKey: "absenceTypeId",
  targetKey: "id",
});

AbsenceType.hasMany(Absence, {
  foreignKey: "absenceTypeId",
  sourceKey: "id",
});

Employee.hasMany(Absence, {
  foreignKey: "employeeId",
  sourceKey: "id",
});

Absence.belongsTo(Employee, {
  foreignKey: "employeeId",
  targetKey: "id",
  allowNull: false,
});
