import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema({
  nameRu: { type: String, required: true, min: 2 },
  nameHe: { type: String, required: false, min: 2 },
});

const Chapter = mongoose.model("Chapter", ChapterSchema, "chapters");

export default Chapter;
