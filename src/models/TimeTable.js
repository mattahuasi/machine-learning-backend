import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Employee } from "./User.js";

export const TimeTable = sequelize.define("timeTables", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  toleranceDelay: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toleranceLack: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toleranceOutput: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  earlyExit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  punctuality: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  //Schedule almacena los horarios para cada día de la semana
  // El campo `schedule` almacena un array de objetos con los siguientes campos:
  //
  // * `entry`: ingreso de un dia de la semana.
  // * `exit`: salida de un dia de la semana.
  // * `enable`: habilitación de un dia de la semana.
  schedule: {
    type: DataTypes.JSONB,
  },
});

TimeTable.hasMany(Employee, {
  foreignKey: "timeTableId",
  sourceKey: "id",
});

Employee.belongsTo(TimeTable, {
  foreignKey: "timeTableId",
  targetKey: "id",
  allowNull: false,
  unique: true,
});
