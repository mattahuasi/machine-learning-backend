import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import absenceRoutes from "./routes/absence.routes.js";
import absenceTypeRoutes from "./routes/absenceType.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cardRoutes from "./routes/card.routes.js";
import cardTypeRoutes from "./routes/cardType.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import entryRoutes from "./routes/entry.routes.js";
import roleRoutes from "./routes/role.routes.js";
import statRoutes from "./routes/stat.routes.js";
import timeTableRoutes from "./routes/timeTable.routes.js";
import turnstileRoutes from "./routes/turnstile.routes.js";
import vacationRoutes from "./routes/vacation.routes.js";

const app = express();

app.set("appName", process.env.APP_NAME || "API");
app.set("port", process.env.PORT || 3000);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", absenceRoutes);
app.use("/api", absenceTypeRoutes);
app.use("/api", authRoutes);
app.use("/api", cardRoutes);
app.use("/api", cardTypeRoutes);
app.use("/api", employeeRoutes);
app.use("/api", entryRoutes);
app.use("/api", roleRoutes);
app.use("/api", statRoutes);
app.use("/api", timeTableRoutes);
app.use("/api", turnstileRoutes);
app.use("/api", vacationRoutes);

export default app;
