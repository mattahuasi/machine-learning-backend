import { TimeTable } from "../models/TimeTable.js";

//crear un tiempo
export const createTimeTable = async (req, res) => {
  try {
    const {
      title,
      description,
      toleranceDelay,
      toleranceLack,
      toleranceOutput,
      earlyExit,
      punctuality,
      priority,
      schedule,
    } = req.body;
    const newTimetable = await TimeTable.create({
      title,
      description,
      toleranceDelay,
      toleranceLack,
      toleranceOutput,
      earlyExit,
      punctuality,
      priority,
      schedule,
    });
    return res.json(newTimetable);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

//obtiene la tabla de tiempo
export const getTimeTables = async (req, res) => {
  try {
    const timeTable = await TimeTable.findAll();
    res.json(timeTable);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

//obtener un solo tiempo
export const getTimeTable = async (req, res) => {
  try {
    const timeTable = await TimeTable.findByPk(req.params.id);
    res.json(timeTable);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};

//actualizar un tiempo
export const updateTimeTable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      toleranceDelay,
      toleranceLack,
      toleranceOutput,
      earlyExit,
      punctuality,
      priority,
      schedule,
    } = req.body;
    const timeTable = await TimeTable.findByPk(id);
    timeTable.title = title;
    timeTable.description = description;
    timeTable.toleranceDelay = toleranceDelay;
    timeTable.toleranceLack = toleranceLack;
    timeTable.toleranceOutput = toleranceOutput;
    timeTable.earlyExit = earlyExit;
    timeTable.punctuality = punctuality;
    timeTable.priority = priority;
    timeTable.schedule = schedule;
    await timeTable.save();
    res.json(timeTable);
  } catch (error) {
    res.status(500).json({
      errors: [error.message],
    });
  }
};
