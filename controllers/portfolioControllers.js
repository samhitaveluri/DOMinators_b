import pool from '../config/db.js';

export const getPortfolioSummary = async(req, res) => {
    try {
        // Step 1: Get the settlements account balance
        const [settlementsResult] = await pool.query('SELECT * FROM settlements');
        const settlementsBalance = settlementsResult.length > 0 ? parseFloat(settlementsResult[0].amount) : 0;
        
        // Step 2: Get all holdings with their details
        const [holdings] = await pool.query(`
            SELECT h.id, h.asset_id, h.quantity, h.purchase_price, h.purchase_date, a.name
            FROM holdings h
            JOIN assets a ON h.asset_id = a.id
        `);
        
        // Step 3: Calculate the total purchase value of all holdings
        let totalPurchaseValue = 0;
        for (const holding of holdings) {
            totalPurchaseValue += parseFloat(holding.quantity) * parseFloat(holding.purchase_price);
        }
        
        // Step 4: Get the current prices of all assets in holdings
        const assetIds = holdings.map(holding => holding.asset_id);
        let totalCurrentValue = 0;
        
        if (assetIds.length > 0) {
            const assetIdsStr = assetIds.join(',');
            const [assets] = await pool.query(`SELECT id, price FROM assets WHERE id IN (${assetIdsStr})`);
            
            // Create a map of asset IDs to their current prices
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
        
        // Step 5: Calculate total portfolio value and profit/loss
        const totalValue = settlementsBalance + totalCurrentValue;
        const profitLoss = totalCurrentValue - totalPurchaseValue;
        const profitLossPercentage = totalPurchaseValue > 0 
            ? (profitLoss / totalPurchaseValue) * 100 
            : 0;
            
        // Step 6: Get counts for additional metrics
        const [holdingsCountResult] = await pool.query('SELECT COUNT(*) as count FROM holdings');
        const holdingsCount = holdingsCountResult[0]?.count || 0;
        
        const [transactionsCountResult] = await pool.query('SELECT COUNT(*) as count FROM transactions');
        const transactionsCount = transactionsCountResult[0]?.count || 0;
        
        // Step 7: Create asset allocation data for visualization
        const assetAllocation = [];
        if (assetIds.length > 0) {
            const [assetCategories] = await pool.query(`
                SELECT a.type, SUM(h.quantity * a.price) as value
                FROM holdings h
                JOIN assets a ON h.asset_id = a.id
                GROUP BY a.type
            `);
            
            // Convert to percentages
            const totalAssetValue = totalCurrentValue || 1; // Prevent division by zero
            assetCategories.forEach(category => {
                assetAllocation.push({
                    name: category.type,
                    value: Math.round((parseFloat(category.value) / totalAssetValue) * 100)
                });
            });
        }
        
        // Step 8: Generate mock historical data for the chart
        // In a real application, you would retrieve this from a historical data table
        // const history = generateMockHistoryData(totalValue);
        
        // Step 9: Return the complete portfolio summary
        res.json({
            total_value: totalValue,
            total_invested: totalPurchaseValue,
            profit_loss: profitLoss,
            profit_loss_percentage: profitLossPercentage,
            holdings_count: holdingsCount,
            transactions_count: transactionsCount,
            cash_balance: settlementsBalance,
            // Mock performance metrics - in a real app these would be calculated from historical data
            daily_change: 1.2,
            weekly_change: 2.8,
            monthly_change: -0.5,
            yearly_change: 8.4,
            // history: history,
            asset_allocation: assetAllocation
        });
        
    } catch (error) {
        console.error('Error in getPortfolioSummary:', error);
        res.status(500).json({ 
            error: 'Failed to fetch portfolio summary',
            details: error.message 
        });
    }
};

// Helper function to generate mock historical data for the chart
function generateMockHistoryData(currentValue) {
    const today = new Date();
    const data = [];
    
    for (let i = 90; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        
        // Generate somewhat realistic price movements
        // Start lower and trend upward with random fluctuations
        const baseValue = currentValue * 0.85; // Start at 85% of current value
        const trendFactor = (i / 90) * 0.15; // Trend factor increases over time
        const randomFactor = Math.random() * 0.05 - 0.025; // Random fluctuation ±2.5%
        
        const value = baseValue + (baseValue * trendFactor) + (baseValue * randomFactor);
        
        data.push({
            date: formattedDate,
            value: value.toFixed(2)
        });
    }
    
    return data;
}