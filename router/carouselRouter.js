import express from "express";
import {
  createCarouselImage,
  getCarouselImage,
  getCarouselImages,
} from "../controllers/carouselController.js";
import { verifyJWT } from "../middleWares/verifyJWT.js";

const router = express.Router();

router.route("/").get(getCarouselImage).post(verifyJWT, createCarouselImage);
router.route("/carouselImages").get(getCarouselImages);

export default router;
