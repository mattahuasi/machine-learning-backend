import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createdAccessToken } from "../libs/jwt.js";
import { Role } from "../models/Role.js";
import { Employee, User } from "../models/User.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await Employee.findOne({
      where: { email, status: "1", staff: true },
      attributes: ["id", "email", "password", "status", "admin"],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "address", "ci", "phone"],
        },
        { model: Role, attributes: ["id", "name"] },
      ],
    });
    if (!userFound) return res.status(404).json({ errors: ["User not found"] });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(404).json({ errors: ["Password incorrect"] });

    const token = await createdAccessToken({
      id: userFound.id,
    });

    res.json({
      id: userFound.id,
      email: userFound.email,
      admin: userFound.admin,
      role: {
        id: userFound.role.id,
        name: userFound.role.name,
      },
      user: {
        id: userFound.user.id,
        firstName: userFound.user.firstName,
        lastName: userFound.user.lastName,
        ci: userFound.user.ci,
        address: userFound.user.address,
        phone: userFound.user.phone,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const updatePassword = async (req, res) => {
  const { newPassword, oldPassword, repeatPassword } = req.body;
  try {
    const userFound = await Employee.findOne({
      where: { id: req.user.id },
    });
    if (newPassword !== repeatPassword)
      return res.status(500).json({ errors: ["Las contraseñas no coinciden"] });

    if (!userFound) return res.status(404).json({ errors: ["User not found"] });

    const isMatch = await bcrypt.compare(oldPassword, userFound.password);

    if (!isMatch)
      return res.status(500).json({ errors: ["Contraseña incorrecta"] });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    userFound.password = passwordHash;
    userFound.save();
    res.json({ id: userFound.id });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  try {
    const userFound = await Employee.findOne({
      where: { id: req.user.id },
      attributes: ["id", "email"],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "address", "ci", "phone"],
        },
        { model: Role, attributes: ["id", "name"] },
      ],
    });
    if (!userFound) return res.status(400).json({ errors: ["User not found"] });

    res.json(userFound);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ errors: ["Unauthorized"] });
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
      if (err) return res.status(401).json({ errors: ["Unauthorized"] });
      const userFound = await Employee.findOne({
        where: { id: user.id, status: "1", staff: true },
        attributes: ["id", "email", "status", "admin"],
        include: [
          {
            model: User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "address",
              "ci",
              "phone",
            ],
          },
          { model: Role, attributes: ["id", "name"] },
        ],
      });
      if (!userFound) return res.status(401).json({ errors: ["Unauthorized"] });
      res.json(userFound);
    });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, ci, address, phone } = req.body;
    const employee = await Employee.findOne({
      where: { id: req.user.id },
      attributes: ["id", "email", "userId"],
    });
    if (!employee) return res.status(400).json({ errors: ["User not found"] });
    const user = await User.findOne({ where: { id: employee.userId } });

    user.firstName = firstName;
    user.lastName = lastName;
    user.ci = ci;
    user.address = address;
    user.phone = phone;

    await user.save();
    const userFound = await Employee.findOne({
      where: { id: req.user.id },
      attributes: ["id", "email"],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "address", "ci", "phone"],
        },
        { model: Role, attributes: ["id", "name"] },
      ],
    });
    res.json(userFound);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
