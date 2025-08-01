// CREATE TABLE Holdings (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     asset_id INT NOT NULL,
//     isOwn BOOLEAN NOT NULL,
//     quantity DECIMAL(15, 2) NOT NULL,
//     purchase_price DECIMAL(15, 2) NOT NULL,
//     purchase_date DATE NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (asset_id) REFERENCES Assets(id)
// );
import { z } from 'zod';

export const holdingSchema = z.object({
    id: z.number().int().positive(), // Holding ID must be a positive integer
    asset_id: z.number().int().positive(), // Asset ID must be a positive integer
    isOwn: z.boolean(), // isOwn must be a boolean value
    quantity: z.number().nonnegative(), // Quantity must be a non-negative number
    purchase_price: z.number().nonnegative(), // Purchase price must be a non-negative number
    purchase_date: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Purchase date must be a valid date string',
    }), // Purchase date must be a valid date string
    created_at: z.string().optional(), // Optional timestamp
});