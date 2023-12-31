require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

const createTableProduct = async () => {
    try {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        sku VARCHAR(50) UNIQUE,
        image VARCHAR(255),
        price DECIMAL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      )
    `;

        await client.query(createTableQuery);

        console.log('Product table created successfully');
    } catch (error) {
        console.error('Error creating product table:', error);
    }
};

const createTableAdjustmentTransaction = async () => {
    try {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS adjustment_transactions (
        id SERIAL PRIMARY KEY,
        sku VARCHAR(50) NOT NULL,
        qty NUMERIC NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      )
    `;

        await client.query(createTableQuery);

        console.log('Adjustment Transaction table created successfully');
    } catch (error) {
        console.error('Error creating Adjustment Transaction table:', error);
    }
};

module.exports = {
    client,
    connectToDatabase,
    createTableProduct,
    createTableAdjustmentTransaction
};