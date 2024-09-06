/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
      .createTable("user", (table) => {  //create new user table
        table.increments("user_id").primary();
        table.string("username");
        table.string("email");
        table.string("password");
        table.string("name");
      })
};

exports.down = (knex) => {
  return knex.raw('drop schema public cascade; create schema public;"');
};

