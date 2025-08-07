# Portfolio Management API

This is a Node.js-based API for managing a financial portfolio, including assets, holdings, transactions, settlements, and user authentication. It uses Express.js for routing, MySQL for data storage, and Zod for input validation. The application supports user registration, login, asset purchasing/selling, and portfolio summary generation.

## Features

- **User Authentication**: Register and login with JWT-based authentication and PIN verification.
- **Asset Management**: Retrieve all assets or a specific asset by ID.
- **Holdings Management**: Buy and sell assets, view all holdings, or view a specific holding.
- **Portfolio Summary**: Get a detailed summary of portfolio performance, including total value, profit/loss, and asset allocation.
- **Settlements**: View the balance in the settlements account.
- **Transactions**: View all transaction records.
- **Net Worth Tracking**: Automatically updates net worth daily using a scheduled job.
- **Price Updates**: Simulates real-time asset price updates every second.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Git (for cloning the repository)
- A code editor like Visual Studio Code (recommended)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd portfolio-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
DB_HOST=localhost
DB_USER=<your-mysql-username>
DB_PASSWORD=<your-mysql-password>
DB_NAME=portfolio
DB_PORT=3306
JWT_SECRET=<your-jwt-secret>
NODE_ENV=development
```

### 4. Set Up the MySQL Database

```sql
-- Log in to MySQL
mysql -u <your-mysql-username> -p

-- Create the database
CREATE DATABASE portfolio;

-- Create the Holdings table (example)
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

Refer to the schema definitions in the `schemas` directory for other table structures.

#### (Optional) Populate Sample Data

```sql
INSERT INTO Assets (name, type, price) VALUES ('Apple Inc.', 'Stock', 150.00);
INSERT INTO Settlements (amount) VALUES (10000.00);
```

### 5. Run the Application

```bash
npm start
```

Server will run at `http://localhost:3000`.

### 6. Run Tests

```bash
npm test
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register`: Register a new user.
  ```json
  { "username": "string", "password": "string", "security_pin": "string" }
  ```

- `POST /login`: Log in and receive JWT.
  ```json
  { "username": "string", "password": "string" }
  ```

- `POST /verify-pin`: Verify PIN.
  ```json
  { "pin": "string" }
  ```
  Headers: `Authorization: Bearer <token>`

### Asset Routes (`/api/assets`)

- `GET /get-all`: Retrieve all assets.
- `GET /get/:id`: Retrieve asset by ID.

### Holding Routes (`/api/holdings`)

- `POST /buy`: Purchase an asset.
  ```json
  { "asset_id": number, "quantity": number }
  ```

- `GET /`: Retrieve all holdings.
- `GET /:id`: Retrieve holding by ID.
- `POST /sell`: Sell a holding.
  ```json
  { "holding_id": number, "quantity": number }
  ```

### Transaction Routes (`/api/transactions`)

- `GET /get-all-transactions`: Get all transactions.

### Settlement Routes (`/api/settlements`)

- `GET /viewBalance`: Get settlement balance.

### Portfolio Routes (`/api/portfolio`)

- `GET /summary`: Detailed portfolio summary.

### Net Worth Routes (`/api/networth`)

- `GET /get-networth`: Retrieve net worth history.

## Scheduled Jobs

- **Asset Price Updates**: Asset prices updated every second.
- **Net Worth Updates**: Net worth calculated daily at 11:59:30 PM.

## Project Structure

```
portfolio-management-api/
├── config/              # DB configuration
├── controllers/         # Controllers
├── routes/              # Routes
├── schemas/             # Zod schemas
├── __tests__/           # Tests
├── .env                 # Environment config
├── index.js             # Entry point
├── package.json         # Dependencies
└── README.md
```

## Dependencies

- `express`: Web framework
- `mysql2`: MySQL client
- `zod`: Schema validation
- `jsonwebtoken`: JWT auth
- `bcrypt`: Password hashing
- `cors`: CORS support
- `node-schedule`: Scheduler
- `jest`: Testing

## Testing

Unit tests for:

- Asset controllers (`getAllAssets`, `getAssetById`)
- Net worth controller (`getNetWorth`)
- Settlement controller (`viewBalance`)
- Transaction schema

Run with:

```bash
npm test
```

## Notes

- Ensure MySQL server is running before starting the app.
- App uses a connection pool for DB queries.
- Price updates use random values to simulate markets.
- In production, set `NODE_ENV=production` in `.env` for secure cookie handling.

## Troubleshooting

- **DB Connection Errors**: Check MySQL credentials and DB status.
- **Port Conflicts**: Change the `PORT` in `.env`.
- **Missing Dependencies**: Run `npm install`.

For help, check logs or raise an issue on the repository.
