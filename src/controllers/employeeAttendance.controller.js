import { EmployeeAttendance } from "../models/EmployeeAttendance.js";
import { TimeTable } from "../models/TimeTable.js";
import { Employee } from "../models/User.js";

//registrar entrada de empleado
export const registerEntry = async (req, res) => {
  const employeeId = req.params.employeeId;
  try {
    const employee = await Employee.findByPk(employeeId, {
      include: [TimeTable],
    });
    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Obtiene el horario de trabajo del empleado
    const dayOfWeek = new Date().getDay(); // Obtiene el día de la semana actual (0: domingo, 1: lunes, ..., 6: sábado)
    const schedule = employee.timeTable.schedule;

    if (!schedule || !schedule[dayOfWeek] || !schedule[dayOfWeek].enable) {
      return res.status(404).json({
        message: "Horario de trabajo no encontrado para el día actual",
      });
    }

    // Obtiene la hora de entrada registrada por el empleado (puedes ajustar esto según tus necesidades)
    const entryTime = new Date();

    // Compara la hora de entrada con el horario de trabajo
    if (entryTime <= new Date(schedule[dayOfWeek].entry)) {
      // El empleado llegó a tiempo
      await EmployeeAttendance.create({
        entryHour: entryTime,
        day: new Date(),
        punctuality: "onTime",
        employeeId,
      });
    } else {
      // El empleado llegó con retraso
      await EmployeeAttendance.create({
        entryHour: entryTime,
        day: new Date(),
        punctuality: "late",
        employeeId,
      });
    }

    res.status(201).json({ message: "Entrada registrada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
