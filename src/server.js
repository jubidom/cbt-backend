import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

//.env config path
const configPath = path.join(__dirName, "./config.env");
dotenv.config({ path: configPath });

const DB = process.env.DB_URL;
const PORT = process.env.PORT || 4000;

mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to database");
    app.listen(PORT, () => console.log("server is running"));
  })
  .catch((error) =>
    console.log(`Unable to connect to the database ${error.message}`)
  );
