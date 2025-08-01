import { assetSchema } from '../schemas/assetValidation.js';
import { holdingSchema } from '../schemas/holdingValidation.js';
import { transactionSchema } from '../schemas/transactionValidation.js';
import pool from '../config/db.js';

export const buyAsset = async (req, res) => {
    const { asset_id, quantity } = req.body;
    
    try {
        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Check if asset exists and get its price
            const [asset] = await connection.query(
                'SELECT * FROM Assets WHERE id = ?',
                [asset_id]
            );

            if (asset.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Asset not found' });
            }

            // 2. Calculate total cost
            const totalCost = asset[0].price * quantity;

            // Check if user has enough money
            const [settlement] = await connection.query('SELECT amount FROM Settlements');
            if (settlement.length === 0 || settlement[0].amount < totalCost) {
                await connection.rollback();
                return res.status(400).json({ message: 'Insufficient funds' });
            }

            // 3. Deduct money from settlements
            await connection.query(
                'UPDATE Settlements SET amount = amount - ?',
                [totalCost]
            );

            // Create holding
            const [holding] = await connection.query(
                'INSERT INTO Holdings (asset_id, isOwn, quantity, purchase_price, purchase_date) VALUES (?, true, ?, ?, CURDATE())',
                [asset_id, quantity, asset[0].price]
            );

            // 4. Create transaction record
            await connection.query(
                'INSERT INTO Transactions (type, holding_id, amount, date, description) VALUES (?, ?, ?, CURDATE(), ?)',
                ['Investment', holding.insertId, totalCost, `Purchased ${quantity} units of ${asset[0].name}`]
            );

            await connection.commit();
            res.status(201).json({
                message: 'Asset purchased successfully',
                holding_id: holding.insertId,
                total_cost: totalCost
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error buying asset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const viewAllHoldings = async (req, res) => {
    try {
        const [holdings] = await pool.query(
            `SELECT h.id, a.name, h.quantity, h.purchase_price, h.purchase_date
             FROM Holdings h
             JOIN Assets a ON h.asset_id = a.id
             WHERE h.isOwn = true`
        );

        if (holdings.length === 0) {
            return res.status(404).json({ message: 'No holdings found' });
        }

        res.status(200).json(holdings);
    } catch (error) {
        console.error('Error fetching holdings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const viewHoldingById = async (req, res) => {
    const { id } = req.params;

    try {
        const [holding] = await pool.query(
            `SELECT h.id, a.name, h.quantity, h.purchase_price, h.purchase_date
             FROM Holdings h
             JOIN Assets a ON h.asset_id = a.id
             WHERE h.id = ? AND h.isOwn = true`,
            [id]
        );

        if (holding.length === 0) {
            return res.status(404).json({ message: 'Holding not found' });
        }

        res.status(200).json(holding[0]);
    } catch (error) {
        console.error('Error fetching holding by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};