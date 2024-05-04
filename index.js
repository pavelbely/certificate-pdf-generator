import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { drawPdf } from './utils.js';
import Chapter from './models/chapter.js';
import { ObjectId } from 'mongodb';
// import * as fs from 'fs';

const { DATABASE_URL } = process.env;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  res.send('OK');
});

// TODO change to post when finish testing
app.get('/certificate', async (req, res) => {
  const { chapterId, firstName, lastName } = req.query;
  if (!chapterId) {
    res.status(400).send('Missing chapterId');
    return;
  }
  let id;
  try {
    id = ObjectId.createFromHexString(chapterId);
  } catch (err) {
    res.status(400).send('Invalid chapterId');
    return;
  }

  await maybeSetBuyer(firstName, lastName);
  const buyer = chapter.buyer;
  // if (!chapter.buyer) { // TODO
  if (!buyer?.firstName || !buyer?.lastName) {
    res.status(400).send('Buyer not set');
  }
  const pdfStream = await drawPdf(buyer);
  pdfStream.pipe(res);
  res.attachment('pdfname.pdf');

  // pdfStream.pipe(fs.createWriteStream('output.pdf'));
  // res.send('PDF generated!');
});

mongoose.connect(DATABASE_URL)
  .then(connection => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
