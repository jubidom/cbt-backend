import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Admin must provide a fullname"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Admin must provide an email"],
    validate: [validator.isEmail, "Admin must provide email"],
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, "Admin must enter a passwowrd"],
    minlength: [8, "Password must not be less than 8 characters"],
    trim: true,
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, "Admin must enter a passwowrd"],
    minlength: [8, "Password must not be less than 8 characters"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "Passwords do not match",
    },
    trim: true,
    select: false,
  },

  adminID: {
    type: String,
    required: [true, "Admin must have an ID"],
    unique: true,
    uppercase: true,
    trim: true,
  },

  roles: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetTokenExpires: Date,
});

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

studentSchema.methods.correctPassword = async function (
  candidatePasswowrd,
  userPassword
) {
  return await bcrypt.compare(candidatePasswowrd, userPassword);
};

studentSchema.methods.wasPasswordChangedAfter = async function (jwtIAT) {
  if (this.passwordChangedAt) {
    const initialPasswordTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return initialPasswordTimestamp > jwtIAT;
  }
  return false;
};

studentSchema.methods.generatePasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Student = mongoose.model("Student", studentSchema);
export default Student;
