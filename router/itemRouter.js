import express from "express";
import {
  addNewItem,
  getItemImages,
  getItems,
} from "../controllers/itemController.js";

const router = express.Router();

router.route("/").get(getItems).post(addNewItem);
router.route("/itemImages").get(getItemImages);

export default router;
