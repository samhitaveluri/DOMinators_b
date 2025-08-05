import { getAllAssets, getAssetById } from '../controllers/assetControllers.js';
import pool from '../config/db.js';
import { assetSchema } from '../schemas/assetValidation.js';

jest.mock('../config/db.js');

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
});

afterAll(() => {
  console.error.mockRestore(); // Restore console.error after tests
});

describe('Asset Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAssets', () => {
    it('should return all assets on success', async () => {
      const mockAssets = [{ id: 1, name: 'Asset 1' }, { id: 2, name: 'Asset 2' }];
      pool.query.mockResolvedValue([mockAssets]);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAllAssets(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Assets');
      expect(res.json).toHaveBeenCalledWith(mockAssets);
    });

    it('should return a 500 error on failure', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAllAssets(req, res);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Assets');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch assets' });
    });
  });

  describe('getAssetById', () => {
    it('should return the asset if found', async () => {
      const mockAsset = { id: 1, name: 'Asset 1' };
      pool.query.mockResolvedValue([[mockAsset]]);
      jest.spyOn(assetSchema.shape.id, 'parse').mockReturnValue(1);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAssetById(req, res);

      expect(assetSchema.shape.id.parse).toHaveBeenCalledWith(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Assets WHERE id = ?', [1]);
      expect(res.json).toHaveBeenCalledWith(mockAsset);
    });

    it('should return a 404 error if the asset is not found', async () => {
      pool.query.mockResolvedValue([[]]);
      jest.spyOn(assetSchema.shape.id, 'parse').mockReturnValue(1);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAssetById(req, res);

      expect(assetSchema.shape.id.parse).toHaveBeenCalledWith(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Assets WHERE id = ?', [1]);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Asset not found' });
    });

    it('should return a 500 error on failure', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));
      jest.spyOn(assetSchema.shape.id, 'parse').mockReturnValue(1);

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAssetById(req, res);

      expect(assetSchema.shape.id.parse).toHaveBeenCalledWith(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM Assets WHERE id = ?', [1]);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch asset' });
    });

    it('should return a 500 error if ID validation fails', async () => {
      jest.spyOn(assetSchema.shape.id, 'parse').mockImplementation(() => {
        throw new Error('Validation error');
      });

      const req = { params: { id: 'invalid' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getAssetById(req, res);

      expect(assetSchema.shape.id.parse).toHaveBeenCalledWith(NaN);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch asset' });
    });
  });
});
