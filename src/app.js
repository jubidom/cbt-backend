import express from "express";
import cors from "cors";
import morgan from "morgan";
import ErrorHandler from "./utils/ErrorHandler.js";
import globalErrorController from "./controllers/globalErrorController.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

//type of environment
process.env.NODE_ENV === "development" && app.use(morgan("dev"));

//routes middleware
app.use("api/v1/users", adminRouter);

//page not found
app.use((req, res, next) => {
  return next(
    new ErrorHandler(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorController);
export default app;
