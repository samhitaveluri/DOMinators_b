// CREATE TABLE Assets (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(100) NOT NULL,
//     type ENUM('Stock', 'Mutual Fund', 'Bond', 'Cash', 'Other') NOT NULL,
//     price DECIMAL(15, 2) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

import { z } from 'zod';

export const assetSchema = z.object({
  id: z.number().int().positive(), // Asset ID must be a positive integer
  name: z.string().min(1, 'Name is required'), // Name must be a non-empty string
  type: z.enum(['Stock', 'Mutual Fund', 'Bond', 'Cash', 'Other']), // Type must match one of the allowed values
  price: z.number().nonnegative(), // Price must be a non-negative number
  created_at: z.string().optional(), // Optional timestamp
});