- [ ] include unit tests
- [ ] insights maybe
- [ ] settlements account
- [ ] gains and losses 
- [ ] use use strict
- [ ] protection - auth 

Here’s the updated database schema with the `user_id` field removed and a `created_at` field added to every table. Additionally, I’ve included a user story for your financial dashboard.

---

### Updated Database Schema

#### 1. **Assets**
```sql
CREATE TABLE Assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('Stock', 'Mutual Fund', 'Bond', 'Cash', 'Other') NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **Holdings**
```sql
CREATE TABLE Holdings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    isOwn BOOLEAN NOT NULL,
    quantity DECIMAL(15, 2) NOT NULL,
    purchase_price DECIMAL(15, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES Assets(id)
);
```

#### 3. **Transactions**
```sql
CREATE TABLE Transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('Income', 'Expense', 'Investment', 'Withdrawal') NOT NULL,
    holding_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (holding_id) REFERENCES Holdings(id)
);
```

#### 4. **NetWorth**
```sql
CREATE TABLE NetWorth (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. **GainsAndFlows**
```sql
CREATE TABLE GainsAndFlows (
    id INT PRIMARY KEY AUTO_INCREMENT,
    holding_id INT NOT NULL,
    gain DECIMAL(15, 2) NOT NULL,
    flow DECIMAL(15, 2) NOT NULL,
    percentage_change DECIMAL(5, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (holding_id) REFERENCES Holdings(id)
);
```

#### 6. **InvestmentSummary**
```sql
CREATE TABLE InvestmentSummary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_type ENUM('Stock', 'Mutual Fund', 'Bond', 'Cash', 'Other') NOT NULL,
    total_value DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. **Settlements**
```sql
CREATE TABLE Settlements(
    amount DECIMAL(20, 2)
);

INSERT INTO Settlements (amount) VALUES (100000);
```

####Inserting values into assets

INSERT INTO Assets (id, name, type, price, created_at) VALUES
-- Stocks
(1, 'Apple Inc.', 'Stock', 195.25, '2025-08-01 10:00:00'),
(2, 'Microsoft Corporation', 'Stock', 345.67, '2025-08-01 10:01:00'),
(3, 'Tesla Inc.', 'Stock', 267.89, '2025-08-01 10:02:00'),
(4, 'Amazon.com Inc.', 'Stock', 142.34, '2025-08-01 10:03:00'),
(5, 'Alphabet Inc. Class A', 'Stock', 128.56, '2025-08-01 10:04:00'),
(6, 'Meta Platforms Inc.', 'Stock', 321.45, '2025-08-01 10:05:00'),
(7, 'NVIDIA Corporation', 'Stock', 440.12, '2025-08-01 10:06:00'),
(8, 'Berkshire Hathaway Inc. Class B', 'Stock', 354.98, '2025-08-01 10:07:00'),
(9, 'Johnson & Johnson', 'Stock', 168.75, '2025-08-01 10:08:00'),
(10, 'Visa Inc.', 'Stock', 240.34, '2025-08-01 10:09:00'),

-- Mutual Funds
(11, 'Vanguard Total Stock Market Index Fund', 'Mutual Fund', 110.45, '2025-08-01 10:10:00'),
(12, 'Fidelity 500 Index Fund', 'Mutual Fund', 160.78, '2025-08-01 10:11:00'),
(13, 'T. Rowe Price Blue Chip Growth Fund', 'Mutual Fund', 152.67, '2025-08-01 10:12:00'),
(14, 'Schwab S&P 500 Index Fund', 'Mutual Fund', 65.89, '2025-08-01 10:13:00'),
(15, 'BlackRock Equity Dividend Fund', 'Mutual Fund', 25.45, '2025-08-01 10:14:00'),

-- Bonds
(16, 'US 10-Year Treasury Bond', 'Bond', 1000.00, '2025-08-01 10:15:00'),
(17, 'US 30-Year Treasury Bond', 'Bond', 1000.00, '2025-08-01 10:16:00'),
(18, 'Corporate Bond - Apple Inc.', 'Bond', 995.50, '2025-08-01 10:17:00'),
(19, 'Corporate Bond - Microsoft', 'Bond', 998.75, '2025-08-01 10:18:00'),
(20, 'Municipal Bond - California', 'Bond', 1020.25, '2025-08-01 10:19:00'),

-- Cash
(21, 'USD Savings Account', 'Cash', 1.00, '2025-08-01 10:20:00'),
(22, 'Euro Savings Account', 'Cash', 1.10, '2025-08-01 10:21:00'),
(23, 'GBP Savings Account', 'Cash', 1.28, '2025-08-01 10:22:00'),
(24, 'Fixed Deposit - Bank of America', 'Cash', 1.00, '2025-08-01 10:23:00'),
(25, 'Money Market Account', 'Cash', 1.00, '2025-08-01 10:24:00'),

-- Other
(26, 'Gold Bullion', 'Other', 1985.45, '2025-08-01 10:25:00'),
(27, 'Silver Bar', 'Other', 25.34, '2025-08-01 10:26:00'),
(28, 'Bitcoin', 'Other', 29500.67, '2025-08-01 10:27:00'),
(29, 'Ethereum', 'Other', 1850.25, '2025-08-01 10:28:00'),
(30, 'Real Estate Investment Trust - Vanguard', 'Other', 92.45, '2025-08-01 10:29:00');


<!-- Asset prices Table -->


CREATE TABLE asset_prices (
    asset_id INT PRIMARY KEY,
    base_present_price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO asset_prices (asset_id, base_present_price) VALUES
(1, 195.25),
(2, 345.67),
(3, 267.89),
(4, 142.34),
(5, 128.56),
(6, 321.45),
(7, 440.12),
(8, 354.98),
(9, 168.75),
(10, 240.34),
(11, 110.45),
(12, 160.78),
(13, 152.67),
(14, 65.89),
(15, 25.45),
(16, 1000.00),
(17, 1000.00),
(18, 995.50),
(19, 998.75),
(20, 1020.25),
(21, 1.00),
(22, 1.10),
(23, 1.28),
(24, 1.00),
(25, 1.00),
(26, 1985.45),
(27, 25.34),
(28, 29500.67),
(29, 1850.25),
(30, 92.45);

## Command to install node-schedule;
npm install node-schedule


##Inserting rows into networth
INSERT INTO NetWorth (total, date) VALUES (98500.00,  '2025-07-07');
INSERT INTO NetWorth (total, date) VALUES (98620.00,  '2025-07-08');
INSERT INTO NetWorth (total, date) VALUES (98810.00,  '2025-07-09');
INSERT INTO NetWorth (total, date) VALUES (98900.00,  '2025-07-10');
INSERT INTO NetWorth (total, date) VALUES (99050.00,  '2025-07-11');
INSERT INTO NetWorth (total, date) VALUES (99200.00,  '2025-07-12');
INSERT INTO NetWorth (total, date) VALUES (99400.00,  '2025-07-13');
INSERT INTO NetWorth (total, date) VALUES (99550.00,  '2025-07-14');
INSERT INTO NetWorth (total, date) VALUES (99780.00,  '2025-07-15');
INSERT INTO NetWorth (total, date) VALUES (99890.00,  '2025-07-16');
INSERT INTO NetWorth (total, date) VALUES (100100.00, '2025-07-17');
INSERT INTO NetWorth (total, date) VALUES (100250.00, '2025-07-18');
INSERT INTO NetWorth (total, date) VALUES (100420.00, '2025-07-19');
INSERT INTO NetWorth (total, date) VALUES (100610.00, '2025-07-20');
INSERT INTO NetWorth (total, date) VALUES (100800.00, '2025-07-21');
INSERT INTO NetWorth (total, date) VALUES (100950.00, '2025-07-22');
INSERT INTO NetWorth (total, date) VALUES (101100.00, '2025-07-23');
INSERT INTO NetWorth (total, date) VALUES (101220.00, '2025-07-24');
INSERT INTO NetWorth (total, date) VALUES (101350.00, '2025-07-25');
INSERT INTO NetWorth (total, date) VALUES (101480.00, '2025-07-26');
INSERT INTO NetWorth (total, date) VALUES (101600.00, '2025-07-27');
INSERT INTO NetWorth (total, date) VALUES (101750.00, '2025-07-28');
INSERT INTO NetWorth (total, date) VALUES (101880.00, '2025-07-29');
INSERT INTO NetWorth (total, date) VALUES (102000.00, '2025-07-30');
INSERT INTO NetWorth (total, date) VALUES (102130.00, '2025-07-31');
INSERT INTO NetWorth (total, date) VALUES (102250.00, '2025-08-01');
INSERT INTO NetWorth (total, date) VALUES (102370.00, '2025-08-02');
INSERT INTO NetWorth (total, date) VALUES (102500.00, '2025-08-03');
INSERT INTO NetWorth (total, date) VALUES (102600.00, '2025-08-04');
INSERT INTO NetWorth (total, date) VALUES (102700.00, '2025-08-05');