const adjustmentTransactionHandler = require('../handlers/adjustment_transaction_handler');

const adjustmentTransactionRoutes = [
    {
        method: 'GET',
        path: '/transactions',
        handler: adjustmentTransactionHandler.getTransactions,
    },
    {
        method: 'GET',
        path: '/transactions/{id}',
        handler: adjustmentTransactionHandler.getTransactionById,
    },
    {
        method: 'POST',
        path: '/transactions',
        handler: adjustmentTransactionHandler.createTransaction,
    },
    {
        method: 'DELETE',
        path: '/transactions/{id}',
        handler: adjustmentTransactionHandler.deleteTransaction,
    },
];

module.exports = adjustmentTransactionRoutes;