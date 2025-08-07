import { getNetWorth } from '../controllers/networthControllers.js';
import pool from '../config/db.js';

// Mock the pool.query method
jest.mock('../config/db.js', () => ({
  query: jest.fn()
}));

describe('getNetWorth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {}; // no need for body/params in GET
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis() // chainable .status().json()
    };
    jest.clearAllMocks();
  });

  it('should fetch networth and return as JSON (success case)', async () => {
    const mockData = [
      { id: 1, asset: 'Stocks', value: 5000 },
      { id: 2, asset: 'Bonds', value: 2000 }
    ];

    pool.query.mockResolvedValue([mockData]);

    await getNetWorth(req, res);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM networth');
    expect(res.json).toHaveBeenCalledWith(mockData);
    expect(res.status).not.toHaveBeenCalled(); // no error
  });

  it('should handle database errors gracefully', async () => {
    const mockError = new Error('Database connection failed');
    pool.query.mockRejectedValue(mockError);

    await getNetWorth(req, res);

    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM networth');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch networth' });
  });

  it('should return an empty array if no records found', async () => {
    pool.query.mockResolvedValue([[]]); // empty table

    await getNetWorth(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });
});
