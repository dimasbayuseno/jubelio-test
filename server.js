const Hapi = require('hapi');
const {connectToDatabase, createTableAdjustmentTransaction, createTableProduct} = require("./db/db");

const init = async () => {
    await connectToDatabase();
    await createTableProduct();
    await createTableAdjustmentTransaction();

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });



    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello, World!';
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
}
    init();
