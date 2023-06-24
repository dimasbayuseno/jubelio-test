const { client } = require('../db/db');

const getProducts = async () => {
    const query = 'SELECT * FROM products';
    const { rows } = await client.query(query);
    return rows;
};

const getProductById = async (id) => {
    const query = 'SELECT * FROM products WHERE id = $1';
    const values = [id];
    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
        throw new Error('Product not found');
    }

    return rows[0];
};

const createProduct = async (productData) => {
    const { name, sku, image, price, description } = productData;
    const query =
        'INSERT INTO products (name, sku, image, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, sku, image, price, description];
    const { rows } = await client.query(query, values);

    return rows[0];
};

const updateProduct = async (id, productData) => {
    const { name, sku, image, price, description } = productData;
    const query =
        'UPDATE products SET name = $1, sku = $2, image = $3, price = $4, description = $5 WHERE id = $6 RETURNING *';
    const values = [name, sku, image, price, description, id];
    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
        throw new Error('Product not found');
    }

    return rows[0];
};

const deleteProduct = async (id) => {
    const query = 'DELETE FROM products WHERE id = $1';
    const values = [id];
    await client.query(query, values);
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};