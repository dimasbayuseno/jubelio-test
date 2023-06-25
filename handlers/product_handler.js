const productModel = require('../models/product_model');
const {fetchProducts} = require("../utils/fetch");
const productValidator = require("../utils/validator");


const getProducts = async (request, h) => {
    const { page, limit } = request.query;

    const pages = page || 1
    const limits = limit || 10

    try {
        const products = await productModel.getProducts(pages, limits);
        return h.response({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
        }).code(200);
    } catch (error) {
        return h.response({
            success: false,
            message: 'Failed to retrieve products',
            error: 'Database error',
        }).code(500);
    }
};

const getProductById = async (request, h) => {
    try {
        const { id } = request.params;
        const product = await productModel.getProductById(id);
        return h.response({
            success: true,
            data: product,
        }).code(200);
    } catch (error) {
        console.error('Error retrieving product', error);
        if (error.message === 'Product not found') {
            return h.response({
                success: false,
                message: 'Product not found',
            }).code(404);
        }
        return h.response({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.',
        }).code(500);
    }
};

const createProduct = async (request, h) => {
    try {
        const productData = request.payload;
        const validationError = productValidator.validateCreateProduct(request.payload);
        if (validationError !== null) {
            return h.response({
                success: false,
                message: 'Validation error',
                error: validationError,
            }).code(400);
        }
        const createdProduct = await productModel.createProduct(productData);
        return h.response({
            success: true,
            message: 'Product created successfully',
            data: createdProduct,
        }).code(200);
    } catch (error) {
        console.error('Error creating product', error);
        return h.response({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.',
        }).code(500);
    }
};

const updateProduct = async (request, h) => {
    try {
        const { id } = request.params;
        const productData = request.payload;
        const validationError = productValidator.validateCreateProduct(request.payload);
        if (validationError !== null) {
            return h.response({
                error: 'Validation Error',
                message: validationError,
            }).code(400);
        }
        const updatedProduct = await productModel.updateProduct(id, productData);
        return h.response({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        }).code(200);
    } catch (error) {
        console.error('Error updating product', error);
        if (error.message === 'Product not found') {
            return h.response({
                error: 'Product Not Found',
                message: 'The requested product was not found.',
            }).code(404);        }
        return h.response({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.',
        }).code(500);    }
};

const deleteProduct = async (request, h) => {
    try {
        const { id } = request.params;
        await productModel.deleteProduct(id);
        return h.response({
            success: true,
            message: 'Product successfully deleted',
            productId: id,
        }).code(200);
    } catch (error) {
        console.error('Error deleting product', error);
        if (error.message === 'Product not found') {
            return h.response({
                error: 'Product Not Found',
                message: 'The requested product was not found.',
            }).code(404);
        }
        return h.response({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.',
        }).code(500);
    }
};

const insertBulkProduct = async (request, h) => {
    const { page, limit } = request.query;

    const pages = page || 1
    const limits = limit || 10

    try {
        await fetchProducts(pages, limits);
        return h.response({
            success: true,
            message: 'Products successfully inserted',
            count: products.length,
            data: products,
        }).code(200);
    } catch (error) {
        return h.response({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.',
        }).code(500);
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