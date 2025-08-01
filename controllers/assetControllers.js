import pool from '../config/db.js';
import { assetSchema } from '../schemas/assetValidation.js';

// Controller to get all assets
export const getAllAssets = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Assets');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

// Controller to get an asset by ID
export const getAssetById = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the ID
    const parsedId = assetSchema.shape.id.parse(Number(id));

    const [rows] = await pool.query('SELECT * FROM Assets WHERE id = ?', [parsedId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching asset by ID:', error);
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
};