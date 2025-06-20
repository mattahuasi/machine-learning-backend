import { Op, fn, literal, col } from "sequelize";
import { Card } from "../models/Card.js";
import { Entry } from "../models/Entry.js";
import { Employee, User } from "../models/User.js";

export const getTotal = async (req, res) => {
  try {
    const date = req.params.date;
    const initDate = new Date(date);
    const finalDate = new Date(date);
    initDate.setUTCHours(initDate.getUTCHours() + 4);
    finalDate.setUTCHours(finalDate.getUTCHours() + 28);
    console.log(initDate);
    console.log(finalDate);
    const entries = await Entry.count({
      where: {
        type: "entry",
        createdAt: {
          [Op.between]: [initDate, finalDate],
        },
      },
    });
    const exits = await Entry.count({
      where: {
        type: "exit",
        createdAt: {
          [Op.between]: [initDate, finalDate],
        },
      },
    });

    const employees = await Employee.count({
      where: { status: "1" },
    });

    res.json({
      entries: entries,
      exits: exits,
      employees: employees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [error] });
  }
};

export const getEntryHour = async (req, res) => {
  try {
    const date = req.params.date;
    const initDate = new Date(date);
    const finalDate = new Date(date);
    initDate.setUTCHours(initDate.getUTCHours() + 4);
    finalDate.setUTCHours(finalDate.getUTCHours() + 28);
    const entryEmployee = await Entry.findAll({
      attributes: ["createdAt"],
      include: [
        {
          model: User,
          attributes: ["id"],
          include: [
            {
              model: Employee,
              attributes: ["id"],
            },
          ],
        },
      ],
      where: {
        type: "entry",
        createdAt: {
          [Op.between]: [initDate, finalDate],
        },
        "$user.employee.id$": {
          [Op.not]: null, // Filtrar las entradas que tengan un Empleado asociado
        },
      },
    });

    const exitEmployee = await Entry.findAll({
      attributes: ["createdAt"],
      include: [
        {
          model: User,
          attributes: ["id"],
          include: [
            {
              model: Employee,
              attributes: ["id"],
            },
          ],
        },
      ],
      where: {
        type: "exit",
        createdAt: {
          [Op.between]: [initDate, finalDate],
        },
        "$user.employee.id$": {
          [Op.not]: null, // Filtrar las entradas que tengan un Empleado asociado
        },
      },
    });

    res.json({
      entryEmployee: entryEmployee,
      exitEmployee: exitEmployee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [error] });
  }
};

export const getEmployeesTotal = async (req, res) => {
  try {
    const employeeInside = await Employee.count({
      include: [
        {
          model: User,
          where: {
            inside: true,
          },
        },
      ],
      where: {
        status: "1",
      },
    });
    const employeeOutside = await Employee.count({
      include: [
        {
          model: User,
          where: {
            inside: false,
          },
        },
      ],
      where: {
        status: "1",
      },
    });
    res.json({
      inside: employeeInside,
      outside: employeeOutside,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [error] });
  }
};

export const getCardsTotal = async (req, res) => {
  try {
    const cardsAssigned = await Card.count({
      where: { userId: { [Op.not]: null } },
    });
    const cardsUnassigned = await Card.count({
      where: { userId: { [Op.eq]: null } },
    });
    res.json({
      assigned: cardsAssigned,
      unassigned: cardsUnassigned,
    });
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};
