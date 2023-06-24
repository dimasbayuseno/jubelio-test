const productModel = require('../models/product_model');
const {fetchProducts} = require("../utils/fetch");


const getProducts = async (request, h) => {
    const { page, limit } = request.query;

    const pages = page || 1
    const limits = limit || 10

    try {
        const products = await productModel.getProducts(pages, limits);
        return h.response(products).code(200);
    } catch (error) {
        return h.response('Error retrieving products').code(500);
    }
};

const getProductById = async (request, h) => {
    try {
        const { id } = request.params;
        const product = await productModel.getProductById(id);
        return product;
    } catch (error) {
        console.error('Error retrieving product', error);
        if (error.message === 'Product not found') {
            return h.response('Product not found').code(404);
        }
        return h.response('Internal Server Error').code(500);
    }
};

const createProduct = async (request, h) => {
    try {
        const productData = request.payload;
        const createdProduct = await productModel.createProduct(productData);
        return createdProduct;
    } catch (error) {
        console.error('Error creating product', error);
        return h.response('Internal Server Error').code(500);
    }
};

const updateProduct = async (request, h) => {
    try {
        const { id } = request.params;
        const productData = request.payload;
        const updatedProduct = await productModel.updateProduct(id, productData);
        return updatedProduct;
    } catch (error) {
        console.error('Error updating product', error);
        if (error.message === 'Product not found') {
            return h.response('Product not found').code(404);
        }
        return h.response('Internal Server Error').code(500);
    }
};

const deleteProduct = async (request, h) => {
    try {
        const { id } = request.params;
        await productModel.deleteProduct(id);
        return;
    } catch (error) {
        console.error('Error deleting product', error);
        if (error.message === 'Product not found') {
            return h.response('Product not found').code(404);
        }
        return h.response('Internal Server Error').code(500);
    }
};

const insertBulkProduct = async (request, h) => {
    try {
        await fetchProducts();
        return h.response("Successfully insert products").code(200);
    } catch (error) {
        return h.response('Internal Server Error').code(500);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    insertBulkProduct
};