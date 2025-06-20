import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { Card, CardType } from "../models/Card.js";
import { Role } from "../models/Role.js";
import { TimeTable } from "../models/TimeTable.js";
import { Employee, User } from "../models/User.js";

export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      ci,
      address,
      phone,
      email,
      password,
      staff,
      admin,
      roleId,
      timeTableId, // Nuevo parámetro de horario
    } = req.body;

    const userEmail = await Employee.findOne({ where: { email } });
    if (userEmail)
      return res.status(400).json({ errors: ["El correo ya existe"] });

    const userCi = await Employee.findOne({
      include: [{ model: User, where: { ci } }],
    });
    if (userCi)
      return res.status(400).json({ errors: ["El ci ya esta ingresado"] });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      ci,
      address,
      phone,
    });

    const myUser = await Employee.findByPk(req.user.id);
    if (myUser.admin) {
      const newEmployee = await Employee.create({
        email,
        password: passwordHash,
        roleId,
        userId: newUser.id,
        staff,
        admin,
        timeTableId, // Asignar el ID del horario
      });
      return res.json(newEmployee);
    } else {
      const newEmployee = await Employee.create({
        email,
        password: passwordHash,
        roleId,
        userId: newUser.id,
        staff: false,
        admin: false,
        timeTableId, // Asignar el ID del horario
      });
      return res.json(newEmployee);
    }
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getEmployeesAdmin = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: ["id", "email", "status", "createdAt", "staff", "admin"],
      where: { status: { [Op.ne]: "0" }, id: { [Op.ne]: req.user.id } },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "ci",
            "address",
            "phone",
            "inside",
          ],
          include: [
            {
              model: Card,
              include: [
                {
                  model: CardType,
                  attributes: ["id", "name", "color"],
                },
              ],
            },
          ],
        },
        { model: Role, attributes: ["id", "name"] },
      ],
      order: [["id", "ASC"]],
    });

    // ! esta variable no se usa: const myUser = await User.findByPk(req.user.id);
    const employeesModify = employees.map((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      ci: user.user.ci,
      address: user.user.address,
      phone: user.user.phone,
      role: user.role.name,
      status: user.status,
      inside: user.user.inside,
      card: user.user.card ? user.user.card.cardType.color : "",
      staff: user.staff,
      admin: user.admin,
    }));
    res.json(employeesModify);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getEmployeesStaff = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: ["id", "email", "status", "createdAt", "staff"],
      where: {
        status: { [Op.ne]: "0" },
        id: { [Op.ne]: req.user.id },
        admin: false,
      },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "ci",
            "address",
            "phone",
            "inside",
          ],
          include: [
            {
              model: Card,
              include: [
                {
                  model: CardType,
                  attributes: ["id", "name", "color"],
                },
              ],
            },
          ],
        },
        { model: Role, attributes: ["id", "name"] },
      ],
      order: [["id", "ASC"]],
    });

    const employeesModify = employees.map((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      firstName: user.user.firstName,
      lastName: user.user.lastName,
      ci: user.user.ci,
      address: user.user.address,
      phone: user.user.phone,
      role: user.role.name,
      status: user.status,
      inside: user.user.inside,
      card: user.user.card ? user.user.card.cardType.color : "",
    }));
    res.json(employeesModify);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id, {
      attributes: ["id", "email", "status", "staff", "admin"],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "ci", "address", "phone"],
        },
        { model: Role, attributes: ["id", "name"] },
      ],
    });
    const data = {
      id: employee.id,
      email: employee.email,
      createdAt: employee.createdAt,
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
      ci: employee.user.ci,
      address: employee.user.address,
      phone: employee.user.phone,
      roleId: employee.role.id,
      status: employee.status,
      userId: employee.user.id,
    };

    const myUser = await Employee.findByPk(req.user.id);
    if (myUser.admin) {
      data.staff = employee.staff;
      data.admin = employee.admin;
    }
    res.json(data);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, ci, address, phone, role, staff, admin } =
      req.body;

    console.log("Empleado");
    const employee = await Employee.findByPk(id, {
      attributes: ["id", "email", "roleId", "userId"],
    });
    console.log(employee);

    const user = await User.findByPk(employee.userId);

    const userCi = await Employee.findOne({
      include: [{ model: User, where: { ci } }],
    });

    if (userCi.ci === user.ci && userCi.id != user.id)
      return res.status(400).json({ errors: ["El ci ya esta ingresado"] });

    console.log(user.ci);
    console.log(ci);
    user.firstName = firstName;
    user.lastName = lastName;
    if (user.ci != ci) user.ci = ci;
    user.address = address;
    user.phone = phone;

    const myUser = await Employee.findByPk(req.user.id);
    if (myUser.admin) {
      employee.staff = staff;
      employee.admin = admin;
    }
    employee.roleId = role;
    await user.save();
    await employee.save();
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

export const updateStatusEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (employee.status === "1") employee.status = 2;
    else employee.status = 1;
    employee.save();
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error.message] });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    employee.status = 0;
    employee.save();
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

// Obtener empleado y su horario
export const getEmployeeTimeTable = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id, {
      include: [{ model: User }, { model: Role }, { model: TimeTable }],
    });

    const data = {
      id: employee.id,
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
      ci: employee.user.ci,
      phone: employee.user.phone,
      status: employee.status,
      roleName: employee.role ? employee.role.name : null,
      timeTable: employee.timeTable
        ? {
            title: employee.timeTable.title,
            toleranceDelay: employee.timeTable.toleranceDelay,
            toleranceLack: employee.timeTable.toleranceLack,
            toleranceOutput: employee.timeTable.toleranceOutput,
            earlyExit: employee.timeTable.earlyExit,
            punctuality: employee.timeTable.punctuality,
            priority: employee.timeTable.priority,
            schedule: employee.timeTable.schedule,
          }
        : null,
      createdAt: employee.createdAt,
    };

    const myUser = await Employee.findByPk(req.user.id);
    if (myUser.admin) {
      data.staff = employee.staff;
      data.admin = employee.admin;
    }
    res.json(data);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};

//obtener todos los empleados y horarios
export const getEmployeesTimes = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ model: User }, { model: Role }, { model: TimeTable }],
      order: [["id", "ASC"]],
    });

    const employeesData = employees.map((employee) => ({
      id: employee.id,
      firstName: employee.user.firstName,
      lastName: employee.user.lastName,
      ci: employee.user.ci,
      phone: employee.user.phone,
      roleName: employee.role ? employee.role.name : null,
      status: employee.status,
      timeTable: employee.timeTable
        ? {
            title: employee.timeTable.title,
            toleranceDelay: employee.timeTable.toleranceDelay,
            toleranceLack: employee.timeTable.toleranceLack,
            toleranceOutput: employee.timeTable.toleranceOutput,
            earlyExit: employee.timeTable.earlyExit,
            punctuality: employee.timeTable.punctuality,
            priority: employee.timeTable.priority,
            schedule: employee.timeTable.schedule,
          }
        : null,
      createdAt: employee.createdAt,
    }));

    const myUser = await Employee.findByPk(req.user.id);
    if (myUser.admin) {
      employeesData.forEach((employee) => {
        employee.staff = employee.staff;
        employee.admin = employee.admin;
      });
    }
    res.json(employees);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: [error] });
  }
};

//modificar horario de un empleado
export const updateEmployeeTimeTable = async (req, res) => {
  const { id } = req.params;
  const { timeTableId } = req.body;
  try {
    const employee = await Employee.findByPk(id);
    employee.timeTableId = timeTableId;
    employee.save();
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ errors: [error] });
  }
};
