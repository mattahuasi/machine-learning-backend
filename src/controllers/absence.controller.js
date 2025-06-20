import { Sequelize } from "sequelize";
import { Absence, AbsenceType } from "../models/Absence.js";
import { Employee, User } from "../models/User.js";

export const createAbsence = async (req, res) => {
  try {
    const { start, end, detail, documentation, absenceTypeId, employeeId } =
      req.body;

    // Llamar a la función de validación
    await validateAbsenceRequest(start, end);

    const absence = await Absence.create({
      start,
      end,
      detail,
      documentation,
      absenceTypeId,
      employeeId,
    });

    return res.status(201).json(absence);
  } catch (error) {
    res.status(400).json({
      errors: [error.message],
    });
  }
};

export const getAbsences = async (req, res) => {
  try {
    const absences = await Absence.findAll({
      include: [
        {
          model: AbsenceType,
        },
        {
          model: Employee,
          include: [{ model: User }],
        },
      ],
    });
    const absenceModify = absences.map((absence) => ({
      id: absence.id,
      start: absence.start,
      end: absence.end,
      detail: absence.detail,
      documentation: absence.documentation,
      absenceTypeName: absence.absence_type ? absence.absence_type.name : null,
      absenceTypeDetail: absence.absence_type
        ? absence.absence_type.detail
        : null,
      employeeFirstName:
        absence.employee && absence.employee.user
          ? absence.employee.user.firstName
          : null,
      employeeLastName:
        absence.employee && absence.employee.user
          ? absence.employee.user.lastName
          : null,
      employeeCI:
        absence.employee && absence.employee.user
          ? absence.employee.user.ci
          : null,
      employeePhone:
        absence.employee && absence.employee.user
          ? absence.employee.user.phone
          : null,
      createdAt: absence.createdAt,
    }));

    res.json(absenceModify);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getAbsence = async (req, res) => {
  const absenceId = req.params.id;
  try {
    const absence = await Absence.findByPk(absenceId, {
      include: [
        {
          model: AbsenceType,
        },
        {
          model: Employee,
          include: [{ model: User }],
        },
      ],
    });

    if (!absence) {
      res.status(404).json({
        errors: ["Ausencia no encontrada"],
      });
    } else {
      const absenceModify = {
        id: absence.id,
        start: absence.start,
        end: absence.end,
        detail: absence.detail,
        documentation: absence.documentation,
        absenceTypeName: absence.absence_type
          ? absence.absence_type.name
          : null,
        absenceTypeDetail: absence.absence_type
          ? absence.absence_type.detail
          : null,
        employeeFirstName:
          absence.employee && absence.employee.user
            ? absence.employee.user.firstName
            : null,
        employeeLastName:
          absence.employee && absence.employee.user
            ? absence.employee.user.lastName
            : null,
        employeeCI:
          absence.employee && absence.employee.user
            ? absence.employee.user.ci
            : null,
        employeePhone:
          absence.employee && absence.employee.user
            ? absence.employee.user.phone
            : null,
        createdAt: absence.createdAt,
      };

      res.json(absenceModify);
    }
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const updateAbsence = async (req, res) => {
  const absenceId = req.params.id;
  try {
    const { start, end, detail, documentation, absenceTypeId, employeeId } =
      req.body;

    // Llamar a la función de validación
    await validateAbsenceRequest(start, end, absenceId);

    const absence = await Absence.findByPk(absenceId);
    if (!absence) {
      return res.status(404).json({
        errors: ["Ausencia no encontrada"],
      });
    }

    await absence.update({
      start,
      end,
      detail,
      documentation,
      absenceTypeId,
      employeeId,
    });

    return res.json(absence);
  } catch (error) {
    res.status(400).json({
      errors: [error.message],
    });
  }
};

export const deleteAbsence = async (req, res) => {
  const absenceId = req.params.id;
  try {
    const absence = await Absence.findByPk(absenceId);

    if (!absence) {
      return res.status(404).json({
        errors: ["Ausencia no encontrada"],
      });
    }

    const { start } = absence;

    // Llamar a la función de validación
    await validateAbsenceRequest(start);

    // Ahora puedes eliminar la solicitud de ausencia
    await absence.destroy();
    return res.status(204).json();
  } catch (error) {
    res.status(400).json({
      errors: [error.message],
    });
  }
};

const validateAbsenceRequest = async (start, end, absenceId = null) => {
  // Verificar si ya existe una solicitud para el mismo empleado en las mismas fechas
  const existingAbsence = await Absence.findOne({
    where: {
      start: {
        [Sequelize.Op.between]: [start, end],
      },
      end: {
        [Sequelize.Op.between]: [start, end],
      },
      id: {
        [Sequelize.Op.not]: absenceId, // Excluir la ausencia actual si se proporciona un absenceId
      },
    },
  });

  if (existingAbsence) {
    throw new Error(
      "Ya existe una solicitud de ausencia para el mismo período."
    );
  }

  // Verificar si la fecha de inicio es posterior a la fecha actual (no en el pasado)
  const currentDate = new Date();
  if (new Date(start) < currentDate) {
    throw new Error(
      "La fecha de inicio de la solicitud debe ser en el futuro."
    );
  }

  // Verificar si la fecha de finalización es igual o posterior a la fecha de inicio
  if (new Date(end) < new Date(start)) {
    throw new Error(
      "La fecha de finalización debe ser igual o posterior a la fecha de inicio."
    );
  }
};
