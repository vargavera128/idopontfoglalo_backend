/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
   
    await knex("user").insert([   // Insert data into user table
      {
        username: "admin",
        email: "admin@example.com",
        password: "074aa490729dd8008282479f36ce4620b17d90ffb57088e6de32c891bc3bab0783e1932353cc00c84e10b9a516ccd801dec2156dbff4d68a36911d59318a661a",
        name: "Admin User",
        job_id: 1,
        organization_id: 1,
        department_id: 1,
        dummy_user: false,
        user_created_at: new Date(),
        user_updated_at: new Date(),
      },
    ]);
  };
  