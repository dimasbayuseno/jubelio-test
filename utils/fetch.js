require('dotenv').config();
const fetch = require('cross-fetch');
const productModel = require('../models/product_model');

const fetchProducts = async (page = 1, limit = 10) => {
    const url = `${process.env.JUBELIO_CODE_TEST_URL}?page=${page}&per_page=${limit}`;
    const username = process.env.CONSUMER_USER;
    const password = process.env.CONSUMER_PASS;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products from WooCommerce API');
        }

        const products = await response.json();
        console.log(products)
        const simplifiedProducts = products.map((product) => ({
            sku: product.sku,
            name: product.name,
            image: product.images[0]?.src || "",
            price: product.price,
            description: product.description,
        }));
        console.log(simplifiedProducts)
        await productModel.insertBulkProducts(simplifiedProducts);
        console.log('Products inserted successfully.');
    } catch (error) {
        console.log('Error fetching products from WooCommerce:', error);
    }
};

module.exports = { fetchProducts };