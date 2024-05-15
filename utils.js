import { URL } from 'node:url';
import path from 'path';
import { registerFont, createCanvas, loadImage } from 'canvas';
import { transliterateRuHeb } from './transliterateHeb.js';

const __dirname = new URL('.', import.meta.url).pathname;
const BG_IMAGE_PATH = '/assets/bg.png';
const fontPath = path.join(__dirname, '/assets/NotoSans-Regular.ttf');
const fontHebrewPath = path.join(__dirname, '/assets/NotoSansHebrew-Regular.ttf');
registerFont(fontPath, { family: 'Noto Sans' });
registerFont(fontHebrewPath, { family: 'Noto Sans' });

export const drawPdf = async (buyer) => {
  const canvas = createCanvas(2339, 1654, 'pdf');
  const ctx = canvas.getContext('2d');

  const imagePath = path.join(__dirname, BG_IMAGE_PATH);
  const backgroundImage = await loadImage(imagePath);

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.font = '30px Noto Sans';
  ctx.fillStyle = 'black';
  ctx.fillText(`${buyer.firstName} ${buyer.lastName}`, 130, 420);
  ctx.fillText(transliterateRuHeb(`${buyer.firstName} ${buyer.lastName}`), 2060, 440)
  
  const result = canvas.createPDFStream();
  return result;
};
