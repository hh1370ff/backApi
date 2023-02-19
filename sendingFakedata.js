import Item from "./models/item.js";
import axios from "axios";
import { promises as fs } from "fs";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import path from "path";
import Jimp from "jimp";
import { encode } from "blurhash";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import mongoose from "mongoose";
mongoose.set("strictQuery", true);

try {
  mongoose.connect(
    "mongodb+srv://hh13ff:hh13ffhh13ff@cluster0.mwjwspy.mongodb.net/booking?"
  );
  console.log("connected to Mongo DB");
} catch (error) {
  throw error;
}

/* axios config */
const BASE_URL = "http://localhost:3500/api/items";
export const axiosPublicInstance = axios.create({
  baseURL: BASE_URL,
});

/* cloudinary config */
cloudinary.config({
  cloud_name: "dxn36uxja",
  api_key: "428334914532438",
  api_secret: "UMX4ncpPNy4tSEmnDgun5ZUHEH0",
  secure: true,
});

const clothingItems = [
  {
    price: 5,
    name: "T-Shirt",
    category: "New Arrival",
    shortDescription: "Soft cotton tee perfect for any casual occasion.",
    longDescription:
      "This soft and comfortable cotton t-shirt is a must-have for any wardrobe. With its classic design and breathable fabric, it's perfect for any casual occasion. Available in a variety of colors and sizes, you're sure to find the perfect fit.",
  },
  {
    price: 9,
    name: "Hoodie",
    category: "Best Seller",
    shortDescription: "Stay warm and stylish with this cozy hoodie.",
    longDescription:
      "Made from soft and warm fabric, this hoodie is perfect for chilly days. With its comfortable fit and stylish design, you can wear it to the gym, on a hike, or just around the house. Available in a variety of colors and sizes, it's a versatile addition to any wardrobe.",
  },
  {
    price: 8,
    name: "Jeans",
    category: "Top Rated",
    shortDescription: "Classic denim jeans for any occasion.",
    longDescription:
      "These classic denim jeans are a must-have for any wardrobe. Made from high-quality denim, they're both durable and stylish. With their comfortable fit and versatile design, you can wear them to work, on a date, or just around town. Available in a variety of sizes, you're sure to find the perfect fit.",
  },
  {
    price: 3,
    name: "Tank Top",
    category: "New Arrival",
    shortDescription:
      "Stay cool and comfortable with this lightweight tank top.",
    longDescription:
      "Made from lightweight and breathable fabric, this tank top is perfect for hot days. With its comfortable fit and stylish design, you can wear it to the beach, on a hike, or just around the house. Available in a variety of colors and sizes, it's a versatile addition to any wardrobe.",
  },
  {
    price: 7,
    name: "Dress",
    category: "Best Seller",
    shortDescription: "Elegant and stylish dress for any occasion.",
    longDescription:
      "This elegant and stylish dress is perfect for any occasion. With its comfortable fit and flattering design, you can wear it to a wedding, a party, or a night out on the town. Made from high-quality fabric, it's both durable and beautiful. Available in a variety of sizes and colors, you're sure to find the perfect fit.",
  },
  {
    price: 4,
    name: "Shorts",
    category: "Top Rated",
    shortDescription: "Stay cool and comfortable with these versatile shorts.",
    longDescription:
      "Made from lightweight and breathable fabric, these shorts are perfect for any casual occasion. With their comfortable fit and versatile design, you can wear them to the gym, on a hike, or just around town. Available in a variety of colors and sizes, they're a versatile addition to any wardrobe.",
  },
  {
    price: 6,
    name: "Sweater",
    category: "New Arrival",
    shortDescription: "Stay cozy and stylish with this warm sweater.",
    longDescription:
      "Made from soft and warm fabric, this sweater is perfect for chilly days. With its comfortable fit and stylish design, you can wear it to work, on a date, or just around town. Available in a variety of colors and sizes, it's a versatile addition to any wardrobe.",
  },
  {
    price: 5,
    name: "Baseball Cap",
    category: "Top Rated",
    shortDescription: "Stylish and practical baseball cap for any occasion.",
    longDescription:
      "This stylish and practical baseball cap is a must-have for any wardrobe. Made from high-quality fabric, it's both durable and comfortable. With its versatile design, you can wear it to a baseball game, on a hike, or just around town. Available in a variety of colors and sizes, you're sure to find the perfect fit.",
  },
  {
    price: 9,
    name: "Leather Jacket",
    category: "Best Seller",
    shortDescription: "Stylish and durable leather jacket for any occasion.",
    longDescription:
      "This stylish and durable leather jacket is perfect for any occasion. Made from high-quality leather, it's both durable and comfortable. With its versatile design and flattering fit, you can wear it to a party, on a date, or just around town. Available in a variety of sizes and colors, you're sure to find the perfect fit.",
  },
  {
    price: 8,
    name: "Button-Down Shirt",
    category: "New Arrival",
    shortDescription: "Classic button-down shirt for any formal occasion.",
    longDescription:
      "This classic button-down shirt is a must-have for any formal occasion. Made from high-quality fabric, it's both durable and stylish. With its comfortable fit and versatile design, you can wear it to a wedding, a business meeting, or just out for a night on the town. Available in a variety of sizes and colors, you're sure to find the perfect fit.",
  },
  {
    price: 3,
    name: "Sweatpants",
    category: "Top Rated",
    shortDescription: "Stay comfortable and cozy with these sweatpants.",
    longDescription:
      "Made from soft and comfortable fabric, these sweatpants are perfect for lounging around the house. With their comfortable fit and versatile design, you can wear them to the gym, on a hike, or just around town. Available in a variety of colors and sizes, they're a versatile addition to any wardrobe.",
  },
  {
    price: 7,
    name: "Blouse",
    category: "Best Seller",
    shortDescription: "Elegant and versatile blouse for any occasion.",
    longDescription:
      "This elegant and versatile blouse is perfect for any occasion. Made from high-quality fabric, it's both durable and stylish. With its flattering fit and versatile design, you can wear it to a party, a business meeting, or just out for a night on the town. Available in a variety of sizes and colors, you're sure to find the perfect fit.",
  },
  {
    price: 4,
    name: "Cargo Shorts",
    category: "New Arrival",
    shortDescription:
      "Durable and practical cargo shorts for any outdoor activity.",
    longDescription:
      "Made from durable and breathable fabric, these cargo shorts are perfect for any outdoor activity. With their comfortable fit and practical design, you can wear them on a hike, a fishing trip, or just around town. Available in a variety of colors and sizes, they're a versatile addition to any wardrobe.",
  },
];

const uploadFakeFiles = async () => {
  try {
    const files = await fs.readdir(path.join(__dirname, "pic_ecom"));

    for (let i = 0; i < files.length; i++) {
      /*  receiving url from cloudinary */
      const { url: photo } = await cloudinary.uploader.upload(
        path.join(__dirname, "pic_ecom", files[i]),
        {
          upload_preset: "upload",
        }
      );

      /* other stuffs from fake data */
      const { price, name, category, shortDescription, longDescription } =
        clothingItems[i % clothingItems.length];

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

      /* creating new item */
      const newItem = {
        price,
        name,
        category,
        photo,
        shortDescription,
        longDescription,
        blurHash,
      };

      /* creating new Item in Mongodb */
      await Item.create(newItem);
    }
  } catch (err) {
    console.error(err);
  }
};

uploadFakeFiles();
