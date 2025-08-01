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

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});