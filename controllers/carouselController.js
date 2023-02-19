import Carousel from "../models/carousel.js";
import asyncHandler from "express-async-handler";
import axios from "axios";
import Jimp from "jimp";
import { encode } from "blurhash";
import { client } from "../config/redis.js";

// @desc Create carousel Image
// @route POST /carousel Image
// @access Private
export const createCarouselImage = asyncHandler(async (req, res) => {
  const { title, photo } = req.body;

  // Confirm data
  if (!title || !photo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Download the image from its URL using Axios
  const response = await axios.get(photo, { responseType: "arraybuffer" });

  // Load the image from the response data
  const image = await Jimp.read(response.data);

  // Resize the image to a smaller size
  const resizedImage = image.resize(
    image.bitmap.width / 4,
    image.bitmap.height / 4
  );

  // Generate the blurHash string
  const blurHash = encode(
    resizedImage.bitmap.data,
    resizedImage.bitmap.width,
    resizedImage.bitmap.height,
    4,
    3
  );

  // Create and store the new Carousel Image
  const carouselImage = await Carousel.create({ title, photo, blurHash });

  if (carouselImage) {
    // Created
    return res.status(201).json({ message: "New carousel image created" });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid carousel image data received" });
  }
});

// @desc Get all carousel images
// @route GET /carousel images
// @access Public
export const getCarouselImage = asyncHandler(async (req, res) => {
  // Get all carousel images from MongoDB
  const images = await Carousel.find().lean();

  // If no carousel image
  if (!images?.length) {
    return res.status(400).json({ message: "No Image found" });
  }

  res.status(200).json(images);
});

export const getCarouselImages = asyncHandler(async (req, res) => {
  /* check whether carousel images are cached */
  let carouselImages = await client.get("carouselImages");
  if (carouselImages) return res.status(200).json(JSON.parse(carouselImages));

  // Get all carousel  from MongoDB
  const carousels = await Carousel.find().lean();
  // If no carousel
  if (!carousels?.length) {
    return res.status(400).json({ message: "No carousel image found" });
  }
  /* cache carousels */
  await cacheCarouselImages(carousels);

  /* send response */
  carouselImages = await client.get("carouselImages");
  res.status(200).json(JSON.parse(carouselImages));
});

/* redis */
const cacheCarouselImages = async (carousels) => {
  const imageList = await Promise.all(
    carousels.map((carousel) => Jimp.read(carousel.photo))
  );

  const newCarouselsList = await Promise.all(
    imageList.map(async (image, index) => {
      image.resize(4 * 250, 3 * 250);
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      const urlObject = new URL(
        `data:${Jimp.MIME_JPEG};base64,${buffer.toString("base64")}`
      );
      return { carouselId: carousels[index]._id, imageURL: urlObject };
    })
  );
  client.set("carouselImages", JSON.stringify(newCarouselsList));
};
