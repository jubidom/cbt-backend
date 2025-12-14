import util, { promisify } from "util";
import jwt from "jsonwebtoken";
import { token } from "morgan";
import Student from "../models/StudentModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { signJWT } from "../utils/signJWT.js";

const signUp = asyncErrorHandler(async function (req, res, next) {
  let newStudentAccount = await Student.create({
    fullName: req.body.fullName,
    email: req.body.email,
    passwowrd: req.body.password,
    confirmPassword: req.body.confirmPassword,
    regNumber: req.body.regNumber,
    discipline: req.body.discipline,
    roles: req.body.roles,
  });

  if (!newStudentAccount) {
    return next(new ErrorHandler("Failed to create new student account", 400));
  }

  const token = signJWT(newStudentAccount._id);

  res.status(201).json({
    status: "success",
    message: "New student account, created successfully",
    data: newStudentAccount,
  });
});

const login = asyncErrorHandler(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email && !password) {
    return next(new ErrorHandler("Email or password is invalid", 404));
  }

  const studentAccountFound = await Student.findById({ email }).select(
    "+password"
  );

  if (
    !studentAccountFound ||
    !(await studentAccountFound.correctPassword(
      password,
      studentAccountFound.password
    ))
  ) {
    return next(
      new ErrorHandler("Account does not exist on the database", 404)
    );
  }

  const token = signJWT(studentAccountFound._id);

  res.status(200).json({
    status: "success",
    token,
    data: studentAccountFound,
  });
});

const protectedRoute = async function (req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("Please log in to access this resource", 400));
  }

  const verifyToken = promisify(jwt.verify);
  const decodedJWT = await verifyToken(token, process.env.JWT_SECRET);

  const verifyID = await Student.findById(decodedJWT.id);
  if (!verifyID) {
    return next(`Account with this ID ${req.originalURL}, does not exist.`);
  }

  if (verifyID.wasPasswordChangedAfter(decodedJWT.iat)) {
    return next(new ErrorHandler("Please log in", 404));
  }

  req.user = verifyID;
  next();
};

const restrictAccessTo = function (...roles) {
  return asyncErrorHandler(async function (req, res, next) {
    if (!roles.includes(req.user.roles)) {
      return next(
        new ErrorHandler(
          "You do not have the privege to access this resource",
          401
        )
      );
    }
    next();
  });
};

const forgottenPassword = async function (req, res, next) {
  if (!req.body || !req.body.email) {
    return next(new ErrorHandler("Email field cannot be left blank", 404));
  }
  const student = await Student.findById({ email: req.body.email });
  if (!student) {
    return next(new ErrorHandler("Account not found!", 404));
  }

  const resetToken = await student.generatePasswordResetToken();

  const passwordResetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${token}`;

  const passwordResetMessage = `Forgot your password?, Submit a request with your new password and passwordConfirm to: ${passwordResetURL}.\n Please ignore this email, if you didn't forget your password.`;

  try {
  } catch (error) {}
};

const resetPassword = async function (req, res, next) {};

export const authenticate = {
  signUp,
  login,
  protectedRoute,
  restrictAccessTo,
  forgottenPassword,
  resetPassword,
};
