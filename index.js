const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/', async (req, res) => {
  const url = 'https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=players&season=5&sort=points&playertype=skater&position=skaters&rookie=no&statstype=standard&page=1&league=1&key=50c2cd9b5e18e390&client_code=pwhl&format=json';

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': 'https://www.thepwhl.com/',
      'Origin': 'https://www.thepwhl.com'
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const raw = await page.evaluate(() => document.querySelector('body').innerText);

    await browser.close();
    res.setHeader('Content-Type', 'application/json');
    res.send(raw);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
