const fastify = require('fastify')({ logger: true });
const {apiPort, spaUrl, jwtSecret} = require('./common');

fastify.register(require('fastify-cors'), { origin: spaUrl });
fastify.register(require('fastify-jwt'), { secret: jwtSecret });


fastify.get('/number', async (req, reply) => {
    try {
        await req.jwtVerify();
        reply.send({
            user: req.user,
            number: Math.random()
        })
    } catch (err) {
        reply.status(401).send('Unauthorized');
    }
});

(async () => {
    try {
        await fastify.listen(apiPort);
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})();
