import "dotenv/config";
import app from "./app.js";
import mqttHandler from "./libs/mqttHandler.js";
import { sequelize } from "./database/database.js";
import "./models/Absence.js";
import "./models/Card.js";
import "./models/EmployeeAttendance.js";
import "./models/Entry.js";
import "./models/Role.js";
import "./models/TimeTable.js";
import "./models/Turnstile.js";
import "./models/User.js";
import "./models/Vacation.js";

async function main() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");

    app.listen(app.get("port"), () => {
      console.log(`Server listening on port ${app.get("port")}.`);
    });

    const mqttClient = new mqttHandler();
    mqttClient.connect();
  } catch (error) {
    console.log(`Error during initialization: ${error}`);
  }
}

main();
