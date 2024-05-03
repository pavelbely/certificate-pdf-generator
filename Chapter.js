import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nameRu: { type: String, min: 2 },
  nameHe: { type: String, min: 2 },
  buyer: {
    nameRu: { type: String, required: false, min: 2 },
    nameHe: { type: String, required: false, min: 2 },
  },
});

const Chapter = mongoose.model('Chapter', ChapterSchema, 'chapters');

export default Chapter;
