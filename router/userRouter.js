import express from "express";
import { createUser, getAllUsers } from "../controllers/userControllers.js";
import { verifyJWT } from "../middleWares/verifyJWT.js";
const router = express.Router();

router.route("/").get(verifyJWT, getAllUsers);

router.route("/register").post(createUser);

export default router;
