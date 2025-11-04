import express from "express";
import { admin } from "../controllers/adminController.js";
import { authenticate } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authenticate.signUp);
router.post("/login", authenticate.login);

router
  .route("/")
  .get(
    authenticate.protectedRoute,
    authenticate.restrictAccessTo("admin"),
    admin.getAllStudents
  )
  .post(
    authenticate.protectedRoute,
    authenticate.restrictAccessTo("admin"),
    admin.createStudent
  );

router
  .route("/:id")
  .get(
    authenticate.protectedRoute,
    authenticate.restrictAccessTo("admin"),
    admin.getStudent
  )
  .patch(
    authenticate.protectedRoute,
    authenticate.restrictAccessTo("admin"),
    admin.updateStudent
  )
  .delete(
    authenticate.protectedRoute,
    authenticate.restrictAccessTo("admin"),
    admin.deleteStudent
  );

export default router;
