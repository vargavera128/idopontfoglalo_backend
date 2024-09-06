/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "postgis"')
      .createTable("user", (table) => {  //create new user table
        table.increments("user_id").primary();
        table.string("username");
        table.string("email");
        table.string("password");
        table.string("name");
      })
};

exports.down = (knex) => {
  return knex.schema
      .dropTableIfExists("user")
      .raw('DROP EXTENSION IF EXISTS "postgis"');
};

