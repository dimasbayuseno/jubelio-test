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

const validateCreateProduct = (payload) => {
    const {name, sku, image, price, description} = payload;

    if (!name || !sku || !image || !price || !description) {
        return 'Missing required fields';
    }

    if (typeof name !== 'string' || typeof sku !== 'string' || typeof image !== 'string' || typeof price !== 'number' || typeof description !== 'string') {
        return 'Invalid field types';
    }

    return null;
}

module.exports = {
    validateCreateTransaction,
    validateCreateProduct
};