const validateCreateTransaction = (payload) => {
    const {sku, qty } = payload;

    if (!sku || !qty) {
        return 'Missing required fields';
    }

    if (typeof sku !== 'string' || typeof qty !== 'number') {
        return 'Invalid field types';
    }

    return null;
}

module.exports = {
    validateCreateTransaction
};