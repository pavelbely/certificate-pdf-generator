import { URL } from 'node:url';
import express from 'express';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';
// import * as fs from 'fs';

const __dirname = new URL('.', import.meta.url).pathname;

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  res.send('OK');
});

// TODO change to post when finish testing
app.get('/create-pdf', async (req, res) => {
  const canvas = createCanvas(800, 600, 'pdf');
  const ctx = canvas.getContext('2d');

  const imagePath = path.join(__dirname, '/assets/bg.png');
  const backgroundImage = await loadImage(imagePath);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  ctx.font = '40px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Hello, World!', 50, 100);

  const pdfStream = canvas.createPDFStream();
  
  res.attachment('pdfname.pdf');
  pdfStream.pipe(res);

  // pdfStream.pipe(fs.createWriteStream('output.pdf'));
  // res.send('PDF generated!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
