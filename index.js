import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pool from './config/db.js'; 

dotenv.config();

// Import routes
import assetRoutes from './routes/assetRouters.js';
import holdingRoutes from './routes/holdingRouters.js'
import transactionRoutes from './routes/transactionRouters.js';
import settlementRoutes from './routes/settlementRoutes.js';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.send('Hi Mom');
});

app.use('/api/assets', assetRoutes);
app.use('/api/holdings', holdingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/settlements', settlementRoutes);


async function updatePricesRandomly() {
  try {
    const [assets] = await pool.query('SELECT id, price FROM Assets');

    for (let asset of assets) {
      const change = (Math.random() * 20) - 10; // Random change between -10 and +10
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

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});