const fastify = require("fastify")({ logger: true });
const { knex } = require("./database");

fastify.register(require("@fastify/cors"), {  //register CORS
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
});

fastify.register(require("@fastify/jwt"), {  //register JWT token
  secret: process.env.PUBLICATION_JWT_SECRETKEY || "secretKeyForThisProject213edaefw",
});

fastify.decorate("authenticate", async function (request, reply) {  
  try {
    await request.jwtVerify(); 
  } catch (err) {
    reply.send(err);
  }
});

fastify.register(require('@fastify/multipart'));  //register multipart form-data parsing plugin

fastify.register(require("@fastify/swagger"));  //register swagger

fastify.register(require("@fastify/swagger-ui"), {  //register swagger-ui
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

module.exports = { fastify, knex };


const user = require("./routes/user.js");



const start = async () => {
  for (;;) {
    try {
      await knex.raw("select 1+1");
      break;
    } catch (err) {
      console.log(err);
      console.log("Unable to connect to PGSQL, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  
  let version = await knex.raw(
    `SELECT default_version, installed_version FROM pg_available_extensions where name = 'timescaledb'`
  );
  if (!version) {
    console.log("ERROR: TimescaleDB is not installed on the DB instance");
    process.exit(1);
  }

  await knex.migrate.latest({ directory: "dbmigrations" });

 
  fastify.register(user);
 

  fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  });
};

start();
