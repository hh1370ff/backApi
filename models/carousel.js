import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  blurHash: {
    type: String,
    required: true,
  },
});

const Carousel = mongoose.model("Carousel", carouselSchema);

export default Carousel;
