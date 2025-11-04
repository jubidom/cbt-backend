import Student from "../models/StudentModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const getAllStudents = asyncErrorHandler(async function (req, res, next) {
  const students = await Student.find();
  if (!students.length) {
    return next(new ErrorHandler("Students not found!", 404));
  }

  res.status(200).json({
    status: "success",
    results: students.length,
    data: students,
  });
});

const getStudent = asyncErrorHandler(async function (req, res, next) {
  const studentID = req.params.id;
  if (!studentID) {
    return next(
      new ErrorHandler(
        `Student with ID  ${req.originalUrl}, does not exist on the database`,
        404
      )
    );
  }
  const student = await Student.findById(studentID);
  if (!student) {
    return next(new ErrorHandler("Student was not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: student,
  });
});

const createStudent = asyncErrorHandler(async function (req, res, next) {
  const newStudent = await Student.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    regNumber: req.body.regNumber,
    discipline: req.body.discipline,
    roles: req.body.roles,
  });

  if (!newStudent) {
    return next(
      new ErrorHandler("Fill in form fields with required data", 401)
    );
  }

  res.status(201).json({
    status: "success",
    message: "New student account, created successfully",
    data: newStudent,
  });
});

const updateStudent = asyncErrorHandler(async function (req, res, next) {
  const studentID = req.params.id;
  if (!studentID) {
    return next(new ErrorHandler("Please enter a valid user ID", 400));
  }
  const dataToUpdate = req.body;
  if (Object.keys(dataToUpdate).length === 0) {
    return next(new ErrorHandler("Please provide data to update", 400));
  }

  const studentAccount = await Student.findByIdAndUpdate(
    studentID,
    dataToUpdate,
    { new: true, runValidators: true }
  );

  if (!studentAccount) {
    return next(new ErrorHandler("Student not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Student details updated successfully",
    data: studentAccount,
  });
});

const deleteStudent = asyncErrorHandler(async function (req, res, next) {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Student account deleted successfully",
  });
});

export const admin = {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
