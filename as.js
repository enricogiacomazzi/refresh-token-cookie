const fastify = require('fastify')({ logger: true });
const {v4: uuid} = require('uuid');
const {addMinutes, isAfter} = require('date-fns');
const {asPort, spaUrl, jwtSecret, jwtExp} = require('./common');

fastify.register(require('fastify-cors'), { origin: spaUrl, credentials: true });
fastify.register(require('fastify-cookie'));
fastify.register(require('fastify-jwt'), { secret: jwtSecret });


// fakedb
const db = new Map();


fastify.post('/login', (req, reply) => {
    const {username, password} = req.body;
    if(!!username && !! password && username === password) {
        const token = fastify.jwt.sign({username}, {expiresIn: jwtExp});
        const guid = uuid();
        const user = {
            username,
            expire: addMinutes(new Date(), 5),
        }

        db.set(guid, user);
        reply.setCookie('auth', guid, {httpOnly: true}).send({token});
    } else {
        reply.status(401).send('Unauthorized');
    }
  });


  fastify.get('/refresh', (req, reply) => {
    const guid = req.cookies.auth;
    const user = db.get(guid);
    if(user !== undefined && isAfter(user.expire, new Date())) {
        const {username} = user;
        const token = fastify.jwt.sign({username}, {expiresIn: jwtExp});
        user.expire = addMinutes(new Date(), 5);
        db.set(guid, user);
        reply.setCookie('auth', guid, {httpOnly: true}).send({token});
    } else {
        reply.status(401).send('Unauthorized');
    }
  });


(async () => {
    try {
      await fastify.listen(asPort);
      fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
})();
