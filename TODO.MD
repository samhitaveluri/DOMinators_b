- [ ] include unit tests
- [ ] insights maybe
- [ ] settlements account
- [ ] gains and losses 

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
