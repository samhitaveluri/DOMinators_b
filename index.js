import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pool from './config/db.js'; 

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT 1 + 1 AS result');
      res.json({ success: true, result: rows[0].result });
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({ success: false, error: 'Database connection failed' });
    }
});

app.get('/', (req, res) => {
  res.send('Hi Mom');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});