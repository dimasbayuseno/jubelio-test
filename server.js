const Hapi = require('hapi');
const {connectToDatabase, createTableAdjustmentTransaction, createTableProduct} = require("./db/db");
const productRoutes = require("./routes/product_route");
const adjustmentTransactionRoutes = require("./routes/adjustment_transaction_route");

const init = async () => {
    await connectToDatabase();
    await createTableProduct();
    await createTableAdjustmentTransaction();

    const server = Hapi.server({
        port: process.env.PORT,
        host: 'localhost',
    });


    server.route(productRoutes);
    server.route(adjustmentTransactionRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);

}
    init();
