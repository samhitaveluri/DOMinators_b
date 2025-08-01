// CREATE TABLE Transactions (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     type ENUM('Income', 'Expense', 'Investment', 'Withdrawal') NOT NULL,
//     holding_id INT NOT NULL,
//     amount DECIMAL(15, 2) NOT NULL,
//     date DATE NOT NULL,
//     description VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (holding_id) REFERENCES Holdings(id)
// );
import { z } from 'zod';
export const transactionSchema = z.object({
  id: z.number().int().positive(), // Transaction ID must be a positive integer
  type: z.enum(['Income', 'Expense', 'Investment', 'Withdrawal']), // Type must match one of the allowed values
  holding_id: z.number().int().positive(), // Holding ID must be a positive integer
  amount: z.number().nonnegative(), // Amount must be a non-negative number
  date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Date must be a valid date string',
  }), // Date must be a valid date string
  description: z.string().max(255).optional(), // Optional description with a maximum length of 255 characters
  created_at: z.string().optional(), // Optional timestamp
});