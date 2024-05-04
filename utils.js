import { registerFont, createCanvas, loadImage } from 'canvas';
import path from 'path';

const __dirname = import.meta.dirname;
const BG_IMAGE_PATH = '/assets/bg.png';
const fontPath = path.join(__dirname, '/assets/NotoSans-Regular.ttf');
registerFont(fontPath, { family: 'Noto Sans' });

export const drawPdf = async (buyer) => {
  const canvas = createCanvas(2339, 1654, 'pdf');
  const ctx = canvas.getContext('2d');

  const imagePath = path.join(__dirname, BG_IMAGE_PATH);
  const backgroundImage = await loadImage(imagePath);

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.font = '30px Noto Sans';
  ctx.fillStyle = 'black';
  ctx.fillText(`${buyer.firstName} ${buyer.lastName}`, 130, 420);
  
  const result = canvas.createPDFStream();
  return result;
};
