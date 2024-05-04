import { createCanvas, loadImage } from 'canvas';
import path from 'path';

const __dirname = import.meta.dirname;
const BG_IMAGE_PATH = '/assets/bg.png';

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
