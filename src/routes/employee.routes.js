import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { adminRequired } from "../middlewares/admin.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { employeeSchema } from "../schemas/employee.schema.js";
import {
  createEmployee,
  getEmployeesAdmin,
  getEmployeesStaff,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  updateStatusEmployee,
  getEmployeesTimes,
  getEmployeeTimeTable,
  updateEmployeeTimeTable,
} from "../controllers/employee.controller.js";

const router = new Router();
router.post(
  "/employees",
  validateSchema(employeeSchema),
  authRequired,
  createEmployee
);
router.get("/employees/admin", authRequired, adminRequired, getEmployeesAdmin);
router.get("/employees/staff", authRequired, getEmployeesStaff);
router.get("/employees/:id", authRequired, getEmployee);
router.put("/employees/:id", authRequired, updateEmployee);
router.put("/employees/status/:id", authRequired, updateStatusEmployee);
router.delete("/employees/:id", authRequired, deleteEmployee);

//rutas para el horario
router.get("/employees/times", authRequired, getEmployeesTimes);
router.get("/employees/times/:id", authRequired, getEmployeeTimeTable);
router.put("/employees/times/:id", authRequired, updateEmployeeTimeTable);

export default router;
