const { client } = require('../db/db');

const getProducts = async (page, limit) => {
    const offset = (page - 1) * limit;
    const query =
        `SELECT p.name, p.sku, p.image, p.price,
       COALESCE(SUM(at.qty), 0) AS stock
FROM products p
LEFT JOIN (
    SELECT sku, SUM(qty) AS qty
    FROM adjustment_transactions
    GROUP BY sku
) at ON p.sku = at.sku
GROUP BY p.id, p.name, p.sku, p.image, p.price, p.description
ORDER BY p.id ASC LIMIT $1 OFFSET $2`;

    const values = [limit, offset];

    try {
        const { rows } = await client.query(query, values);
        return rows;
    } catch (error) {
        throw new Error('Error retrieving products');
    }
};

const getProductById = async (id) => {
    const query = `SELECT p.name, p.sku, p.image, p.price, p.description,
       COALESCE(SUM(at.qty), 0) AS stock
FROM products p
LEFT JOIN (
    SELECT sku, SUM(qty) AS qty
    FROM adjustment_transactions
    GROUP BY sku
) at ON p.sku = at.sku
WHERE p.id = $1
GROUP BY p.id, p.name, p.sku, p.image, p.price, p.description`;
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
    const { name, sku, image, price, description} = productData;
    const query =
        'UPDATE products SET name = $1, sku = $2, image = $3, price = $4, description = $5, updated_at = NOW() WHERE id = $6 RETURNING *';
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

const insertBulkProducts = async (products) => {
    try {
        const query = 'INSERT INTO products (sku, name, image, price, description) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (sku) DO NOTHING';

        for (const product of products) {
            const values = [product.sku, product.name, product.image, product.price, product.description];
            await client.query(query, values);
        }

        console.log('Products inserted into the database.');
    } catch (error) {
        console.error('Error inserting products:', error);
    }
};

const getProductBySku = async (sku) => {
    const query = 'SELECT * FROM products WHERE sku = $1';
    const values = [sku];
    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    insertBulkProducts,
    getProductBySku
};