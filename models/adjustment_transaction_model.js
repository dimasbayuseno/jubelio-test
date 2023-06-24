const { client } = require('../db/db');

const getTransactions = async (page, limit) => {
    const offset = (page - 1) * limit;
    const query = 'SELECT * FROM adjustment_transactions ORDER BY id ASC LIMIT $1 OFFSET $2';
    const values = [limit, offset];

    const { rows } = await client.query(query, values);
    return rows;
};

const getTransactionById = async (id) => {
    const query = 'SELECT * FROM adjustment_transactions WHERE id = $1';
    const values = [id];
    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
        throw new Error('Transaction not found');
    }

    return rows[0];
};

const createTransaction = async (sku, qty) => {
    const query = 'INSERT INTO adjustment_transactions (sku, qty) VALUES ($1, $2) RETURNING *';
    const values = [sku, qty];

    const { rows } = await client.query(query, values);
    return rows[0];
};

const deleteTransaction = async (id) => {
    const query = 'DELETE FROM adjustment_transactions WHERE id = $1';
    const values = [id];

    await client.query(query, values);
};

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    deleteTransaction,
};