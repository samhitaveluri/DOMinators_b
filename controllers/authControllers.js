import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { userRegistrationSchema, userLoginSchema, pinVerificationSchema } from '../schemas/userValidation.js';

const JWT_SECRET = process.env.JWT_SECRET || 'yourfallbacksecretkey';
const JWT_EXPIRES_IN = '7d';

// Register new user
export const register = async (req, res) => {
  try {
    // Validate request body
    const validatedData = userRegistrationSchema.parse(req.body);
    
    const { username, password, security_pin } = validatedData;
    
    // Hash password and pin
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedPin = await bcrypt.hash(security_pin, saltRounds);
    
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    // Create new user
    const [result] = await pool.query(
      'INSERT INTO Users (username, password, security_pin) VALUES (?, ?, ?)',
      [username, hashedPassword, hashedPin]
    );
    
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.insertId
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    // Validate request body
    const validatedData = userLoginSchema.parse(req.body);
    
    const { username, password } = validatedData;
    
    // Find user
    const [users] = await pool.query(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create and sign JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username 
      }, 
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      },
      token
    });
    
  } catch (error) {
    console.error('Error logging in:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify security PIN
export const verifyPin = async (req, res) => {
  try {
    // Validate request body
    const validatedData = pinVerificationSchema.parse(req.body);
    
    // Get user ID from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find user
      const [users] = await pool.query(
        'SELECT * FROM Users WHERE id = ?',
        [decoded.userId]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const user = users[0];
      
      // Verify PIN
      const isPinValid = await bcrypt.compare(validatedData.pin, user.security_pin);
      
      if (isPinValid) {
        return res.status(200).json({ valid: true });
      } else {
        return res.status(400).json({ valid: false, message: 'Invalid PIN' });
      }
      
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
    
  } catch (error) {
    console.error('Error verifying PIN:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware for protected routes
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};