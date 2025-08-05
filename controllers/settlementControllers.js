import pool from '../config/db.js';

// Controller to get settlements
export const viewBalance = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settlements');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching settlements:', error);
    res.status(500).json({ error: 'Failed to fetch settlements' });
  }
};