const adjustmentTransactionModel = require('../models/adjustment_transaction_model');
const productModel = require('../models/product_model');
const { client } = require('../db/db');
const productValidator = require('../utils/validator');

const getTransactions = async (request, h) => {
    const { page, limit } = request.query;

    const pages = page || 1
    const limits = limit || 10

    try {
        const transactions = await adjustmentTransactionModel.getTransactions(pages, limits);
        return h.response({
            statusCode: 200,
            data: transactions,
            message: 'Successfully retrieved transactions.',
        }).code(200);
    } catch (error) {
        return h.response({
            statusCode: 500,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to retrieve transactions. Please try again later.',
        }).code(500);
    }
};

const getTransactionById = async (request, h) => {
    try {
        const { id } = request.params;
        const transaction = await adjustmentTransactionModel.getTransactionById(id);
        return h.response({
            message: 'Transaction retrieved successfully',
            data: transaction,
        }).code(200);
    } catch (error) {
        console.error('Error retrieving transaction', error);
        if (error.message === 'transaction not found') {
            return h.response({
                message: 'Transaction not found',
                error: 'TRANSACTION_NOT_FOUND_ERROR',
            }).code(404);
        }
        return h.response({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
        }).code(500);
    }
};

const createTransaction = async (request, h) => {
    const { sku, qty } = request.payload;

    const validationError = productValidator.validateCreateTransaction(request.payload);
    if (validationError !== null) {
        return h.response({
            success: false,
            message: validationError,
            error: 'VALIDATION_ERROR',
        }).code(400);
    }

    try {
        const product = await productModel.getProductBySku(sku)
        if (product === null) {
            return h.response({
                success: false,
                message: 'Product not found',
            }).code(404);
        }
        const stock = await adjustmentTransactionModel.getStockBySku(sku)
        let sum = stock + qty
        if (sum < 0 && qty < 0) {
            return h.response({
                success: false,
                message: 'Stock quantity cannot be negative',
            }).code(400);
        }
        const transaction = await adjustmentTransactionModel.createTransaction(sku, qty);

        return h.response({
            message: 'Transaction created successfully',
            data: transaction,
        }).code(200);
    } catch (error) {
        return h.response({
            message: 'Error creating transaction',
            error: 'CREATE_TRANSACTION_ERROR',
        }).code(500);    }
};

const deleteTransaction = async (request, h) => {
    const { id } = request.params;

    try {
        await adjustmentTransactionModel.deleteTransaction(id);
        return h.response({
            success: true,
            message: 'Transaction successfully deleted',
            transactionId: id,
        }).code(204);
    } catch (error) {
        return h.response({
            message: 'Error deleting transaction',
            error: 'DELETE_TRANSACTION_ERROR',
        }).code(500);
    }
};

const updateAdjustmentTransactions = async (request, h) => {
    try {
        const { id } = request.params;
        const transactionData = request.payload;
        const validationError = productValidator.validateCreateTransaction(request.payload);
        if (validationError !== null) {
            return h.response({
                success: false,
                message: validationError,
                error: 'VALIDATION_ERROR',
            }).code(400);
        }
        const product = await productModel.getProductBySku(transactionData.sku)
        if (product === null) {
            return h.response({
                success: false,
                message: 'Product not exist',
            }).code(404);
        }
        const stock = await adjustmentTransactionModel.getStockBySku(transactionData.sku)
        let sum = stock + transactionData.qty
        if (sum < 0 && transactionData.qty < 0) {
            return h.response({
                success: false,
                message: 'Stock quantity cannot be negative',
            }).code(400);        }
        const updatedTransaction = await adjustmentTransactionModel.updateTransactions(id, transactionData);
        return updatedTransaction;
    } catch (error) {
        console.error('Error updating product', error);
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

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    deleteTransaction,
    updateAdjustmentTransactions
};
