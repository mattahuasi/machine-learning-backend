import { Op } from "sequelize";
import { Card } from "../models/Card.js";
import { Entry } from "../models/Entry.js";
import { Role } from "../models/Role.js";
import { Turnstile } from "../models/Turnstile.js";
import { Employee, User } from "../models/User.js";

export const getEntriesExits = async (req, res) => {
  try {
    const { init, final } = req.params;
    const initDate = new Date(init);
    const finalDate = new Date(final);
    initDate.setUTCHours(initDate.getUTCHours() + 4);
    finalDate.setUTCHours(finalDate.getUTCHours() + 28);
    const entries = await Entry.findAll({
      where: {
        createdAt: {
          [Op.between]: [initDate, finalDate],
        },
        "$user.employee.id$": {
          [Op.not]: null, // Filtrar las entradas que tengan un Empleado asociado
        },
      },
      order: [
        ["createdAt", "DESC"], // Ordenar por fecha de creación en orden descendente
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "ci", "address", "phone"],
          include: [{ model: Employee, include: [{ model: Role }] }],
        },
        {
          model: Turnstile,
          attributes: ["name"],
        },
      ],
    });
    const entriesModify = entries.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt,
      fullName: entry.user.firstName + " " + entry.user.lastName,
      ci: entry.user.ci,
      role: entry.user.employee.role.name,
      turnstile: entry.turnstile.name,
      type: entry.type === "entry" ? "Entrada" : "Salida",
    }));
    res.json(entriesModify);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [error] });
  }
};

export const getEntries = async (req, res) => {
  try {
    const { init, final } = req.params;
    const initDate = new Date(init);
    const finalDate = new Date(final);
    initDate.setUTCHours(initDate.getUTCHours() + 4);
    finalDate.setUTCHours(finalDate.getUTCHours() + 28);
    const entries = await Entry.findAll({
      where: {
        type: "entry",
        createdAt: {
          [Op.between]: [initDate, finalDate],
        },
        "$user.employee.id$": {
          [Op.not]: null, // Filtrar las entradas que tengan un Empleado asociado
        },
      },
      order: [
        ["createdAt", "DESC"], // Ordenar por fecha de creación en orden descendente
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "ci", "address", "phone"],
          include: [{ model: Employee, include: [{ model: Role }] }],
        },
        {
          model: Turnstile,
          attributes: ["name"],
        },
      ],
    });
    const entriesModify = entries.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt,
      fullName: entry.user.firstName + " " + entry.user.lastName,
      ci: entry.user.ci,
      role: entry.user.employee.role.name,
      turnstile: entry.turnstile.name,
    }));
    res.json(entriesModify);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [error] });
  }
};

export const getExits = async (req, res) => {
  try {
    const { init, final } = req.params;
    const initDate = new Date(init);
    const finalDate = new Date(final);
    initDate.setUTCHours(initDate.getUTCHours() + 4);
    finalDate.setUTCHours(finalDate.getUTCHours() + 28);
    console.log(initDate, finalDate);
    const entries = await Entry.findAll({
      where: {
        type: "exit",
        createdAt: {
          [Op.between]: [initDate, finalDate],
        },
        "$user.employee.id$": {
          [Op.not]: null, // Filtrar las entradas que tengan un Empleado asociado
        },
      },
      order: [
        ["createdAt", "DESC"], // Ordenar por fecha de creación en orden descendente
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "ci", "address", "phone"],
          include: [{ model: Employee, include: [{ model: Role }] }],
        },
        {
          model: Turnstile,
          attributes: ["name"],
        },
      ],
    });
    const entriesModify = entries.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt,
      fullName: entry.user.firstName + " " + entry.user.lastName,
      ci: entry.user.ci,
      role: entry.user.employee.role.name,
      turnstile: entry.turnstile.name,
    }));
    res.json(entriesModify);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [error] });
  }
};

export const getUserEntry = async (req, res) => {
  try {
    const entry = await Entry.findAll({
      where: { userId: req.params.userId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "ci", "address", "phone"],
        },
        {
          model: Turnstile,
          attributes: ["name"],
        },
      ],
    });
    res.json(entry);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await Entry.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "ci", "address", "phone"],
        },
        {
          model: Turnstile,
          attributes: ["name"],
        },
      ],
    });
    res.json(entry);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const createEntry = async (req, res) => {
  const { rfid, turnstile, type } = req.body;
  try {
    const card = await Card.findOne({
      where: { rfid: rfid.trim() },
    });
    if (!card) return res.status(404).json({ res: "I" });
    if (!card.userId) return res.status(404).json({ res: "I" });

    const employee = await Employee.findOne({ where: { userId: card.userId } });
    if (employee) {
      if (employee.status != "1") return res.status(400).json({ res: "I" });
    }
    const getTurnstile = await Turnstile.findOne({
      where: { name: turnstile },
    });

    const newEntry = await Entry.create({
      type,
      turnstileId: getTurnstile.id,
      userId: card.userId,
    });

    const user = await User.findByPk(card.userId);
    if (type === "entry") user.inside = true;
    else if (type === "exit") user.inside = false;
    user.save();

    const response = {
      res: type === "entry" ? "E" : "S",
    };
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

export const createEntryMQTT = async (rfid, turnstile, type) => {
  try {
    const card = await Card.findOne({
      where: { rfid: rfid.trim() },
    });
    if (!card) return "I";
    if (!card.userId) return "I";

    const employee = await Employee.findOne({ where: { userId: card.userId } });
    if (employee) {
      if (employee.status != "1") return "I";
    }
    const getTurnstile = await Turnstile.findOne({
      where: { name: turnstile },
    });

    const newEntry = await Entry.create({
      type,
      turnstileId: getTurnstile.id,
      userId: card.userId,
    });

    const user = await User.findByPk(card.userId);
    if (type === "entry") user.inside = true;
    else if (type === "exit") user.inside = false;
    user.save();

    const response = type === "entry" ? "E" : "S";
    return response;
  } catch (error) {
    console.log(error);
    return "I";
  }
};
