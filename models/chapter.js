import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  nameRu: { type: String, min: 2 },
  nameHe: { type: String, min: 2 },
  buyer: {
    firstName: { type: String, required: false, min: 2 },
    // TODO add lastName
    // nameHe: { type: String, required: false, min: 2 },
  },
});

const Chapter = mongoose.model('Chapter', ChapterSchema);

ChapterSchema.methods.maybeSetBuyer = async (firstName, lastName) => {
  if (!firstName || !lastName) {
    return;
  }
  // TODO lastName
  if (this.buyer?.firstName || this.buyer?.lastName) {
    throw new Error('Buyer already set')
  }
  this.buyer = {
    firstName,
    lastName,
  };
  await this.save();
};

export default Chapter;