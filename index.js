import { URL } from 'node:url';
import express from 'express';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import mongoose from 'mongoose';
import Chapter from './Chapter.js';
import validateChapterBuyer from './utils.js';
// import * as fs from 'fs';

const __dirname = import.meta.dirname;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  res.send('OK');
});

// TODO change to post when finish testing
app.get('/certificate', async (req, res) => {
  if (!req.query.id) {
    //TODO ERROR HANDLING
    res.status(400).send('Missing id');
    return;
  }
  //Getting the buyer's name from the query if it exists
  const { nameRu, nameHe } = req.query;
  //Validating the buyer's name
  const buyer = await validateChapterBuyer(req.query.id, nameRu, nameHe);
  //TODO ERROR HANDLING if the buyer already exists
  
  const canvas = createCanvas(2339, 1654, 'pdf');
  const ctx = canvas.getContext('2d');

  const imagePath = path.join(__dirname, '/assets/bg.png');
  const backgroundImage = await loadImage(imagePath);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`${'Martin'} ${'Belyj'}`, 130, 420);

  const pdfStream = canvas.createPDFStream();
  
  res.attachment('pdfname.pdf');
  pdfStream.pipe(res);

  // pdfStream.pipe(fs.createWriteStream('output.pdf'));
  // res.send('PDF generated!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
