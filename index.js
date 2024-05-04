import { URL } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import { validateChapterBuyer, drawPdf } from './utils.js';
// import * as fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  res.send('OK');
});

// TODO change to post when finish testing
app.get('/certificate', async (req, res) => {
  if (!req.query.id) {
    res.status(400).send('Missing id');
    return;
  }
  //Getting the buyer's name from the query if it exists
  const { nameRu, nameHe } = req.query;
  //Validating the buyer's name
  let buyer;
  try {
    buyer = await validateChapterBuyer(req.query.id, nameRu, nameHe);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }

  const pdfStream = await drawPdf(buyer);
  pdfStream.pipe(res);
  res.attachment('pdfname.pdf');

  // pdfStream.pipe(fs.createWriteStream('output.pdf'));
  // res.send('PDF generated!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
