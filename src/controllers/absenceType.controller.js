import { AbsenceType } from "../models/Absence.js";

export const createAbsenceType = async (req, res) => {
  const { name, detail } = req.body;
  try {
    const absenceType = await AbsenceType.create({ name, detail });
    res.json(absenceType);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getAbsenceTypes = async (req, res) => {
  try {
    const absenceTypes = await AbsenceType.findAll();
    res.json(absenceTypes);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getAbsenceType = async (req, res) => {
  const { id } = req.params;
  try {
    const absenceType = await AbsenceType.findByPk(id);
    if (!absenceType) {
      return res.json({ error: "Tipo de ausencia no encontrado." });
    }
    res.json(absenceType);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const updateAbsenceType = async (req, res) => {
  const { id } = req.params;
  const { name, detail } = req.body;
  try {
    const [updated] = await AbsenceType.update(
      { name, detail },
      { where: { id } }
    );
    if (updated === 0) {
      return res.json({ error: "Tipo de ausencia no encontrado." });
    }
    const updatedAbsenceType = await AbsenceType.findByPk(id);
    res.json(updatedAbsenceType);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const deleteAbsenceType = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await AbsenceType.destroy({ where: { id } });
    if (deleted === 0) {
      return res.json({ error: "Tipo de ausencia no encontrado." });
    }
    res.json({ message: "Tipo de ausencia eliminado con éxito." });
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
