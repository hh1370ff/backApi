import express from "express";
import { login, logout, refresh } from "../controllers/authController.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/refresh").get(refresh);
router.route("/logOut").post(logout);

export default router;
