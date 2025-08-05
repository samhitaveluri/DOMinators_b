import pool from '../config/db.js';

export const getNetWorth = async(req, res) => { 
  try {
    const [rows] = await pool.query('SELECT * FROM networth');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching networth:', error);
    res.status(500).json({ error: 'Failed to fetch networth' });
  } 
}

