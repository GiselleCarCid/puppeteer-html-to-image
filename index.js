const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Aceptar HTML plano
app.use(bodyParser.text({ type: '*/*' }));

app.post('/render', async (req, res) => {
  const html = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Tamaño fijo para que no haya recortes
    await page.setViewport({ width: 1083, height: 611 });

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const imageBuffer = await page.screenshot({ type: 'png' });

    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (err) {
    console.error('Error rendering image:', err);
    res.status(500).send('Error rendering image');
  }
});

app.get('/', (req, res) => {
  res.send('HTML to Image server is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
