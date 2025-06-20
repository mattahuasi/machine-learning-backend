import { Sequelize } from "sequelize";
import { Employee, User } from "../models/User.js";
import { Vacation } from "../models/Vacation.js";

export const getVacations = async (req, res) => {
  try {
    const vacations = await Vacation.findAll({
      include: [
        {
          model: Employee,
          include: [{ model: User }],
        },
      ],
    });
    const vacationModify = vacations.map((vacation) => ({
      id: vacation.id,
      start: vacation.start,
      end: vacation.end,
      dateRequested: vacation.dateRequested,
      status: vacation.status,
      observations: vacation.observations,
      employeeFirstName:
        vacation.employee && vacation.employee.user
          ? vacation.employee.user.firstName
          : null,
      employeeLastName:
        vacation.employee && vacation.employee.user
          ? vacation.employee.user.lastName
          : null,
      employeeCI:
        vacation.employee && vacation.employee.user
          ? vacation.employee.user.ci
          : null,
      employeePhone:
        vacation.employee && vacation.employee.user
          ? vacation.employee.user.phone
          : null,
      createdAt: vacation.createdAt,
    }));

    res.json(vacationModify);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

export const getVacation = async (req, res) => {
  const vacationId = req.params.id;
  try {
    const vacation = await Vacation.findByPk(vacationId, {
      include: [
        {
          model: Employee,
          include: [{ model: User }],
        },
      ],
    });

    if (!vacation) {
      res.status(404).json({
        errors: ["Vacación no encontrada"],
      });
    } else {
      const vacationModify = {
        id: vacation.id,
        start: vacation.start,
        end: vacation.end,
        dateRequested: vacation.dateRequested,
        status: vacation.status,
        observations: vacation.observations,
        employeeFirstName:
          vacation.employee && vacation.employee.user
            ? vacation.employee.user.firstName
            : null,
        employeeLastName:
          vacation.employee && vacation.employee.user
            ? vacation.employee.user.lastName
            : null,
        employeeCI:
          vacation.employee && vacation.employee.user
            ? vacation.employee.user.ci
            : null,
        employeePhone:
          vacation.employee && vacation.employee.user
            ? vacation.employee.user.phone
            : null,
        createdAt: vacation.createdAt,
      };

      res.json(vacationModify);
    }
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

const validateVacationRequest = async (start, end, vacationId = null) => {
  // Verificar si ya existe una solicitud para el mismo empleado en las mismas fechas
  const existingVacation = await Vacation.findOne({
    where: {
      start: {
        [Sequelize.Op.between]: [start, end],
      },
      end: {
        [Sequelize.Op.between]: [start, end],
      },
      id: {
        [Sequelize.Op.not]: vacationId, // Excluir la vacación actual si se proporciona un vacationId
      },
    },
  });

  if (existingVacation) {
    throw new Error(
      "Ya existe una solicitud de vacaciones para el mismo período."
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

export const createVacation = async (req, res) => {
  try {
    const { start, end, dateRequested, status, observations, employeeId } =
      req.body;

    // Llamar a la función de validación
    await validateVacationRequest(start, end);

    const vacation = await Vacation.create({
      start,
      end,
      dateRequested,
      status,
      observations,
      employeeId,
    });

    return res.status(201).json(vacation);
  } catch (error) {
    res.status(400).json({
      errors: [error.message],
    });
  }
};

export const updateVacation = async (req, res) => {
  const vacationId = req.params.id;
  try {
    const { start, end, dateRequested, status, observations } = req.body;

    // Llamar a la función de validación
    await validateVacationRequest(start, end, vacationId);

    const vacation = await Vacation.findByPk(vacationId);
    if (!vacation) {
      return res.status(404).json({
        errors: ["Vacación no encontrada"],
      });
    }

    await vacation.update({
      start,
      end,
      dateRequested,
      status,
      observations,
    });

    return res.json(vacation);
  } catch (error) {
    res.status(400).json({
      errors: [error.message],
    });
  }
};

export const deleteVacation = async (req, res) => {
  const vacationId = req.params.id;
  try {
    const vacation = await Vacation.findByPk(vacationId);

    if (!vacation) {
      return res.status(404).json({
        errors: ["Vacación no encontrada"],
      });
    }

    const { start } = vacation;

    // Llamar a la función de validación
    await validateVacationRequest(start);

    // Ahora puedes eliminar la solicitud de vacaciones
    await vacation.destroy();
    return res.status(204).json();
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
