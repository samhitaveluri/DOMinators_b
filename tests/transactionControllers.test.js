import { transactionSchema } from '../schemas/transactionValidation.js';

describe('Transaction Validation Schema (Zod)', () => {
  const validateAndGetMessage = (data) => {
    try {
      transactionSchema.parse(data);
      return null;
    } catch (e) {
      return e.errors?.[0]?.message || e.message;
    }
  };

  it('should validate a valid transaction', () => {
    const validTransaction = {
      id: 1,
      type: 'Investment',
      holding_id: 2,
      amount: 1000.5,
      date: '2025-08-05',
      description: 'Stock purchase',
      created_at: '2025-08-05T10:00:00Z'
    };

    expect(() => transactionSchema.parse(validTransaction)).not.toThrow();
  });

  it('should fail if id is not positive integer', () => {
    const msg = validateAndGetMessage({
      id: -1,
      type: 'Investment',
      holding_id: 2,
      amount: 1000,
      date: '2025-08-05'
    });
    expect(msg).toMatch(/expected number to be >0/i);
  });

  it('should fail if type is invalid', () => {
    const msg = validateAndGetMessage({
      id: 1,
      type: 'InvalidType',
      holding_id: 2,
      amount: 1000,
      date: '2025-08-05'
    });
    expect(msg).toMatch(/Invalid option/i);
  });

  it('should fail if holding_id is not positive integer', () => {
    const msg = validateAndGetMessage({
      id: 1,
      type: 'Income',
      holding_id: 0,
      amount: 1000,
      date: '2025-08-05'
    });
    expect(msg).toMatch(/expected number to be >0/i);
  });

  it('should fail if amount is negative', () => {
    const msg = validateAndGetMessage({
      id: 1,
      type: 'Expense',
      holding_id: 2,
      amount: -100,
      date: '2025-08-05'
    });
    expect(msg).toMatch(/expected number to be >=0/i);
  });

  it('should fail if date is invalid', () => {
    const msg = validateAndGetMessage({
      id: 1,
      type: 'Expense',
      holding_id: 2,
      amount: 100,
      date: 'invalid-date'
    });
    expect(msg).toMatch(/Date must be a valid date string/i);
  });

  it('should fail if description is too long', () => {
    const msg = validateAndGetMessage({
      id: 1,
      type: 'Expense',
      holding_id: 2,
      amount: 100,
      date: '2025-08-05',
      description: 'a'.repeat(256)
    });
    expect(msg).toMatch(/expected string to have <=255 characters/i);
  });
});
