const productHandler = require('../handlers/product_handler');

const productRoutes = [
    {
        method: 'GET',
        path: '/products',
        handler: productHandler.getProducts,
    },
    {
        method: 'GET',
        path: '/products/{id}',
        handler: productHandler.getProductById,
    },
    {
        method: 'POST',
        path: '/products',
        handler: productHandler.createProduct,
    },
    {
        method: 'PUT',
        path: '/products/{id}',
        handler: productHandler.updateProduct,
    },
    {
        method: 'DELETE',
        path: '/products/{id}',
        handler: productHandler.deleteProduct,
    },
];

module.exports = productRoutes;