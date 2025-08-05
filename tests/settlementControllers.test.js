import { viewBalance } from '../controllers/settlementControllers.js';
import pool from '../config/db.js';

jest.mock('../config/db.js');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
});

afterAll(() => {
  console.error.mockRestore(); // Restore console.error after tests
});

describe('Settlement Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('viewBalance', () => {
    it('should return all settlements on success', async () => {
      const mockSettlements = [{ id: 1, amount: 100 }, { id: 2, amount: 200 }];
      pool.query.mockResolvedValue([mockSettlements]);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await viewBalance(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM settlements');
      expect(res.json).toHaveBeenCalledWith(mockSettlements);
    });

    it('should return a 500 error on failure', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await viewBalance(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM settlements');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions' });
    });
  });
});