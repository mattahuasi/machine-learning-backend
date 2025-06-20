import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";

export const Card = sequelize.define("cards", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  rfid: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
  },
});

export const CardType = sequelize.define("cardTypes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  color: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

CardType.hasOne(Card, {
  foreignKey: "cardTypeId",
  sourceKey: "id",
});

Card.belongsTo(CardType, {
  foreignKey: "cardTypeId",
  targetKey: "id",
});

User.hasOne(Card, {
  foreignKey: "userId",
  sourceKey: "id",
});

Card.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  allowNull: true,
  unique: true,
});
