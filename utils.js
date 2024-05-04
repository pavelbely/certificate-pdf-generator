import Chapter from './Chapter.js';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';

const __dirname = import.meta.dirname;
const BG_IMAGE_PATH = '/assets/bg.png';

/*
Validate the buyer's name
parameters: chapterId - the id of the chapter in db
            nameRu - the buyer's name in Russian (optional)
            nameHe - the buyer's name in Hebrew (optional)
returns: the buyer's name in hebrew and russian
*/
const validateChapterBuyer = async (chapterId, newNameRu, newNameHe) => {
  const chapterDoc = await Chapter.findById(chapterId);
  // If the buyer's name is provided in the query try updating it in the database
  if (newNameRu || newNameHe) {
    return await updateBuyer(chapterDoc, newNameRu, newNameHe);
  } else {
    return await getBuyer(chapterDoc);
  }
};

/*
Update buyer in the database
parameters: chapter - mongoose document of the chapter
            nameRu - the buyer's name in Russian
            nameHe - the buyer's name in Hebrew
returns: updated buyer field from the database or throws an error if the buyer already exists
*/
const updateBuyer = async (chapter, newNameRu, newNameHe) => {
  // If the buyer's name is not provided in the database, update it
  if (isEmpty(chapter.buyer)) {
    chapter.buyer = {
      nameRu: newNameRu,
      nameHe: newNameHe,
    };
    await chapter.save();
    return chapter.buyer;
    // If the buyer's name is already provided in the database, throw an error
  } else {
    throw new Error('Buyer already exists');
  }
};

//If the buyer's name is not provided in the query, get it from the database
const getBuyer = async (chapter) => {
  if (isEmpty(chapter.buyer)) {
    return {
      nameRu: '',
      nameHe: '',
    };
  }
  return chapter.buyer;
};

//return empty if all the values of an object are undefined
const isEmpty = (obj) => {
  return Object.values(obj).every((value) => value === undefined);
};

export default validateChapterBuyer;
export const drawPdf = async (buyer) => {
  const canvas = createCanvas(2339, 1654, 'pdf');
  const ctx = canvas.getContext('2d');

  const imagePath = path.join(__dirname, BG_IMAGE_PATH);
  const backgroundImage = await loadImage(imagePath);

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`${buyer.nameRu}`, 130, 420);
  ctx.fillText(`${buyer.nameHe}`, 2030, 420);
  
  const result = canvas.createPDFStream();
  return result;
};
