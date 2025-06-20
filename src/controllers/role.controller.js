import { Role } from "../models/Role.js";

export const getRoles = async (req, res) => {
  try {
    const role = await Role.findAll();
    res.json(role);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const createRole = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newRole = await Role.create({
      name,
      description,
    });
    return res.json(newRole);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findByPk(id);
    res.json(role);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const role = await Role.findByPk(id);
    role.name = name;
    role.description = description;
    await role.save();
    res.json(role);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
