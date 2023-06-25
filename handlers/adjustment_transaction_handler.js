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
        return h.response(transactions).code(200);
    } catch (error) {
        return h.response('Error retrieving transactions').code(500);
    }
};

const getTransactionById = async (request, h) => {
    try {
        const { id } = request.params;
        const transaction = await adjustmentTransactionModel.getTransactionById(id);
        return transaction;
    } catch (error) {
        console.error('Error retrieving transaction', error);
        if (error.message === 'transaction not found') {
            return h.response('transaction not found').code(404);
        }
        return h.response('Internal Server Error').code(500);
    }
};

const createTransaction = async (request, h) => {
    const { sku, qty } = request.payload;

    const validationError = productValidator.validateCreateTransaction(request.payload);
    if (validationError !== null) {
        return h.response(validationError).code(500);
    }

    try {
        const product = await productModel.getProductBySku(sku)
        if (product === null) {
            return h.response('Product not exist').code(500);
        }
        const stock = await adjustmentTransactionModel.getStockBySku(sku)
        let sum = stock + qty
        if (sum < 0 && qty < 0) {
            return h.response('Stock is below zero').code(500);
        }
        const transaction = await adjustmentTransactionModel.createTransaction(sku, qty);

        return h.response(transaction).code(201);
    } catch (error) {
        return h.response('Error creating transaction').code(500);
    }
};

const deleteTransaction = async (request, h) => {
    const { id } = request.params;

    try {
        await adjustmentTransactionModel.deleteTransaction(id);
        return h.response().code(204);
    } catch (error) {
        return h.response('Error deleting transaction').code(500);
    }
};

const updateAdjustmentTransactions = async (request, h) => {
    try {
        const { id } = request.params;
        const transactionData = request.payload;
        const product = await productModel.getProductBySku(transactionData.sku)
        if (product === null) {
            return h.response('Product not exist').code(500);
        }
        const stock = await adjustmentTransactionModel.getStockBySku(transactionData.sku)
        let sum = stock + transactionData.qty
        if (sum < 0 && transactionData.qty < 0) {
            return h.response('Stock is below zero').code(500);
        }
        const updatedTransaction = await adjustmentTransactionModel.updateTransactions(id, transactionData);
        return updatedTransaction;
    } catch (error) {
        console.error('Error updating product', error);
        if (error.message === 'Product not found') {
            return h.response('Product not found').code(404);
        }
        return h.response('Internal Server Error').code(500);
    }
};

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    deleteTransaction,
    updateAdjustmentTransactions
};
