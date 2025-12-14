import mongoose from "mongoose";
import { trim } from "validator";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      enum: ["arts", "science"],
      required: true,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
