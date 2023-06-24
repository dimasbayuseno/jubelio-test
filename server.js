const Hapi = require('hapi');

const server = Hapi.server({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'Hello, World!';
    },
});

const startServer = async () => {
    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();