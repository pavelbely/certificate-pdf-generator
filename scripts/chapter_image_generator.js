import chapters from './chapter_data.json' assert { type: 'json' };
import fs from 'fs';
import path from 'path';
import { registerFont, createCanvas, loadImage } from 'canvas';

let __dirname = import.meta.dirname;
const BG_IMAGE_PATH = '../assets/torah_scroll.png';
const fontPathRegular = path.join(__dirname, '../assets/Roboto-Regular.ttf');
registerFont(fontPathRegular, { family: 'Roboto' });
const fontPathBold = path.join(__dirname, '../assets/Roboto-Bold.ttf');
registerFont(fontPathBold, { family: 'Roboto' });

for (let title of Object.keys(chapters)) {
  console.log(title, chapters[title]);
  const pdfStream = await drawImage(title, chapters[title]);
  pdfStream.pipe(fs.createWriteStream(`img_${title}.png`));
}

async function drawImage(title, text) {
  const canvas = createCanvas(1231, 1376);
  const ctx = canvas.getContext('2d');
  const imagePath = path.join(__dirname, BG_IMAGE_PATH);
  const backgroundImage = await loadImage(imagePath);

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.font = '90px "Roboto"';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';

  let title_parsed = textSplit(ctx, title, 600);
  for (let [index, element] of title_parsed.entries()) {
    ctx.fillText(`${element}`, 615, 500 + index * 90);
  }

  ctx.font = '52px "Roboto"';
  let text_parsed = textSplit(ctx, text, 600);
  for (let [index, element] of text_parsed.entries()) {
    ctx.fillText(
      `${element}`,
      615,
      600 + 90 * title_parsed.length + index * 52
    );
  }

  const result = canvas.createPNGStream();
  return result;
}

function textSplit(ctx, text, maxWidth) {
  let text_arr = text.split(' ');
  let result = [];
  let single_line = '';
  for (let element of text_arr) {
    if (ctx.measureText(single_line + element).width < maxWidth) {
      single_line += element + ' ';
    } else {
      result.push(single_line.trim());
      single_line = element + ' ';
    }
  }
  result.push(single_line);
  return result;
}
