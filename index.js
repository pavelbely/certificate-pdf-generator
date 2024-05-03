import { URL } from 'node:url';
import express from 'express';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
import mongoose from 'mongoose';
import Chapter from './Chapter.js';
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
  const nameRu = req.query.nameRu;
  const nameHe = req.query.nameHe;
  const chapterDoc = await Chapter.findOne({ id: +req.query.id });
  if (nameRu || nameHe) {
    // TODO implement translation or an equivalent

    //Update buyer's name in the database if it's empty for given chapter
    if (!(chapterDoc.buyer?.nameRu || chapterDoc.buyer?.nameHe)) {
      chapterDoc.buyer = { nameRu: req.query.nameRu, nameHe: req.query.nameHe };
      await chapterDoc.save();
    } else {
      //TODO already bought
    }
  }
  //If the buyer's name is not provided in the query, get it from the database 
  else {
    if (!(chapterDoc.buyer?.nameRu || chapterDoc.buyer?.nameHe)) {
      nameRu = chapterDoc.buyer.nameRu;
      nameHe = chapterDoc.buyer.nameHe;
    }
  }

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
