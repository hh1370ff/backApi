import Item from "../models/item.js";
import asyncHandler from "express-async-handler";
import axios from "axios";
import Jimp from "jimp";
import { encode } from "blurhash";
import { client } from "../config/redis.js";
import { URL } from "url";

// @desc Create item
// @route POST /item
// @access Private
export const addNewItem = asyncHandler(async (req, res) => {
  const { name, shortDescription, longDescription, photo, price, category } =
    req.body;

  // Confirm data
  if (
    !name ||
    !shortDescription ||
    !longDescription ||
    !photo ||
    !price ||
    !category
  ) {
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

  // Create and store the new user
  const item = await Item.create({
    name,
    shortDescription,
    longDescription,
    photo,
    price,
    category,
    blurHash,
  });

  if (item) {
    // Created
    return res.status(201).json({ message: "New item created" });
  } else {
    return res.status(400).json({ message: "Invalid Item data received" });
  }
});

// @desc Get all items
// @route GET /item
// @access Public
export const getItems = asyncHandler(async (req, res) => {
  // Get all items from MongoDB
  const items = await Item.find().lean();
  // If no item
  if (!items?.length) {
    return res.status(400).json({ message: "No Item found" });
  }

  /* send response */
  res.status(200).json(items);
});

// @desc Get all items
// @route GET /item
// @access Public
export const getItemImages = asyncHandler(async (req, res) => {
  /* check whether item images are cached */
  let itemImages = await client.get("itemImages");
  if (itemImages) return res.status(200).json(JSON.parse(itemImages));

  // Get all item  from MongoDB
  const items = await Item.find().lean();
  // If no item
  if (!items?.length) {
    return res.status(400).json({ message: "No item image found" });
  }
  /* cache items */
  await cacheItemImages(items);

  /* send response */
  itemImages = await client.get("itemImages");
  res.status(200).json(JSON.parse(itemImages));
});

/* redis */
const cacheItemImages = async (items) => {
  const imageList = await Promise.all(
    items.map((item) => Jimp.read(item.photo))
  );

  const newItemsList = await Promise.all(
    imageList.map(async (image, index) => {
      image.resize(400, Jimp.AUTO);
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      const urlObject = new URL(
        `data:${Jimp.MIME_JPEG};base64,${buffer.toString("base64")}`
      );
      return { itemId: items[index]._id, imageURL: urlObject };
    })
  );
  client.set("itemImages", JSON.stringify(newItemsList));
};
