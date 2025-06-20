import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";
import { Turnstile } from "./Turnstile.js";

export const Entry = sequelize.define("entries", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Entry, {
  foreignKey: "userId",
  sourceKey: "id",
});

Entry.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

Turnstile.hasMany(Entry, {
  foreignKey: "turnstileId",
  sourceKey: "id",
});

Entry.belongsTo(Turnstile, {
  foreignKey: "turnstileId",
  targetKey: "id",
});
