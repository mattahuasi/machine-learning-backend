import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Employee } from "./User.js";

export const Vacation = sequelize.define("vacations", {
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
  // El campo `dateRequested` es la fecha en que el empleado solicitó la vacación.
  dateRequested: {
    type: DataTypes.DATEONLY,
  },
  // El campo `status` puede ser uno de los siguientes valores:
  //
  // * `pendiente`: La solicitud aún no ha sido procesada.
  // * `aprobado`: La solicitud ha sido aprobada.
  // * `rechazado`: La solicitud ha sido rechazada.
  status: {
    type: DataTypes.STRING,
  },
  observations: {
    type: DataTypes.TEXT,
  },
});

Employee.hasMany(Vacation, {
  foreignKey: "employeeId",
  sourceKey: "id",
});

Vacation.belongsTo(Employee, {
  foreignKey: "employeeId",
  targetKey: "id",
  allowNull: false,
});
