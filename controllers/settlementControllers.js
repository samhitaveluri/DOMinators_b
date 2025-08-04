import pool from '../config/db.js';
// import {transactionSchema } from '../schemas/transactionValidation.js';

// Controller to get all transactions
export const viewBalance = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settlements');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};