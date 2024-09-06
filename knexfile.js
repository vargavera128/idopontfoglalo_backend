const databaseConfig = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST || "localhost", //update to match the service name in Docker Compose
    database: process.env.DB_NAME || "idopontfoglalo",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

module.exports = {
  development: databaseConfig,
  staging: databaseConfig,
  production: databaseConfig,
};