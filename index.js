import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pool from './config/db.js'; 
import schedule from 'node-schedule';
import cookieParser from 'cookie-parser';

dotenv.config();

// Import routes
import assetRoutes from './routes/assetRouters.js';
import holdingRoutes from './routes/holdingRouters.js'
import transactionRoutes from './routes/transactionRouters.js';
import settlementRoutes from './routes/settlementRoutes.js';
import portfolioRoutes from './routes/portfolioRouters.js';
import networthRouters from './routes/networthRouters.js';
import authRoutes from './routes/authRouters.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api', (req, res) => {
  res.send('Hi Mom');
});

app.use('/api/assets', assetRoutes);
app.use('/api/holdings', holdingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/networth', networthRouters);
app.use('/api/auth', authRoutes);

async function updatePricesRandomly() {
  try {
    const [assets] = await pool.query('SELECT id, price FROM Assets');

    for (let asset of assets) {
      const change = (Math.random() * 2) - 1; // Random change between -1 and +1
      const newPrice = Math.max(0, (parseFloat(asset.price) + change).toFixed(2));

      await pool.query(
        'UPDATE Assets SET price = ?, created_at = NOW() WHERE id = ?',
        [newPrice, asset.id]
      );
    }

    // console.log(`Prices updated at ${new Date().toLocaleTimeString()}`);
  } catch (err) {
    console.error('Error updating prices:', err);
  }
}

setInterval(updatePricesRandomly, 1000);

async function updateNetworth() {
  try {
    const [holdings] = await pool.query(`
      SELECT h.id, h.asset_id, h.quantity, h.purchase_price, h.purchase_date, a.name
      FROM holdings h
      JOIN assets a ON h.asset_id = a.id
    `);

    const assetIds = holdings.map(holding => holding.asset_id);
    let totalCurrentValue = 0;

    if (assetIds.length > 0) {
      const assetIdsStr = assetIds.join(',');
      const [assets] = await pool.query(`SELECT id, price FROM assets WHERE id IN (${assetIdsStr})`);


      const assetPrices = {};
      assets.forEach(asset => {
        assetPrices[asset.id] = parseFloat(asset.price);
      });

      // Calculate the current value of all holdings
      for (const holding of holdings) {
        const currentPrice = assetPrices[holding.asset_id] || parseFloat(holding.purchase_price);
        const quantity = parseFloat(holding.quantity);
        totalCurrentValue += quantity * currentPrice;
      }
    }

    const [settlementsResult] = await pool.query('SELECT * FROM settlements');
    const settlementsBalance = settlementsResult.length > 0 ? parseFloat(settlementsResult[0].amount) : 0;
    await pool.query(
      'INSERT INTO networth (total, date, created_at) VALUES (?, CURDATE(), NOW())',
      [settlementsBalance + totalCurrentValue]
    );

    console.log('Net worth updated successfully.');
  } catch (err) {
    console.error('Error updating net worth:', err);
  }
}

// Schedule the updateNetworth function to run at 11:59:30 PM every day
schedule.scheduleJob('30 59 23 * * *', updateNetworth);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
