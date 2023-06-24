const adjustmentTransactionModel = require('../models/adjustment_transaction_model');

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
        const transaction = await transactionModel.gettransactionById(id);
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

    try {
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

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    deleteTransaction,
};
