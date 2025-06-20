import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Turnstile = sequelize.define("turnstiles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
});
