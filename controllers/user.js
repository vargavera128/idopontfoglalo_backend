const { knex } = require("../index.js");
const { pbkdf2 } = require("crypto");
const  {fastify}  = require("../index.js");

const getUsers = async (req, reply) => {  //get all users
  try {
    const user = await knex("users").select("*");
    reply.send(user);
  } catch (error) {
    reply.send(error);
  }
};
const getUserById = async (req, reply) => {  //get user by id
  const { id } = req.params;
  try {
    const user = await knex("users").select("*").where({ id: id });
    reply.send(user[0]);
  } catch (error) {
    reply.send(error);
  }
};
const getUserByEmail = async (req, reply) => {  //get user by email
  const { email } = req.params;
  try {
    const user = await knex("users").select("*").where({ email: email });
    reply.send(user[0]);
  } catch (error) {
    reply.send(error);
  }
};
const addUser = async (req, reply) => {  //add new user
  const { name } = req.body;
  const { email } = req.body;
  const { pass } = req.body;
  const { username } = req.body;
  let hash = await new Promise((resolve, reject) => {
    pbkdf2(pass, '', 100000, 64, "sha512", async (err, derivedKey) => {
      if (err) throw err;
      resolve(derivedKey.toString("hex"));
    });
  });
  try {
    await knex("users").insert({      
      email: email.toLowerCase(),
      pass: await hash,
      username: username,
      name: name,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),      
    });

    reply.code(200).send({ message: `User ${username} has been added` });
  } catch (error) {
    if(error.message.includes("duplicate key value violates unique constraint")){
      console.log("DUPLICATE")
      reply.code(409).send({ message: `User already exists` });

    }
    console.log(error)
  }
};

const deleteUserById = async (req, reply) => {  //delete user by id
  const { id } = req.params;
  try {
    await knex("users").where({ id: id }).del();
    reply.send({ message: `Item ${id} has been removed` });
  } catch (error) {
    reply.send(error);
  }
};
const deleteUserByEmail = async (req, reply) => {  //delete user by email
  const { email } = req.params;
  try {
    await knex("users").where({ email: email }).del();
    reply.send({ message: `User ${email} has been removed` });
  } catch (error) {
    reply.send(error);
  }
};
const deleteUserByUsername = async (req, reply) => {  //delete user by username
  const { username } = req.params;
  try {
    await knex("users").where({ username: username }).del();
    reply.send({ message: `User ${username} has been removed` });
  } catch (error) {
    reply.send(error);
  }
};

const updateUserById = async (req, reply) => {  //update user by id
  const { email } = req.body;
  const { pass } = req.body;
  const { name } = req.body;
  const { username } = req.body;
  const { id } = req.params;
  const { pbkdf2 } = await import("crypto");
  const user = await knex("users").where({ id: id });
  let userUpdate;
  if (pass != undefined) {
    let hash = await new Promise((resolve, reject) => {
      pbkdf2(
        pass,
        '',//user[0].id,
        100000,
        64,
        "sha512",
        async (err, derivedKey) => {
          if (err) throw err;
          resolve(derivedKey.toString("hex"));
        }
      );
    });
    try {
      userUpdate = await knex("users")
        .where({ id: id })
        .update({
          pass: (await hash) || user[0].pass,
          id: user[0].id,
          name: name || user[0].name,
          email: email || user[0].email,
          username: user[0].username,
          updated_at: knex.fn.now(),
        });
      reply.code(200).send({ message: `Successfull edit` });
    } catch (error) {
      reply.send(error);
    }
  } else {
    try {
      userUpdate = await knex("users")
        .where({ username: username })
        .update({
          username: username || user[0].username,
          name: name || user[0].name,
        });
      reply.send(userUpdate[0]);
    } catch (error) {
      reply.send(error);
    }
  }
};


const loginUserByEmail = async (req, reply) => {  //login by email
  const { email } = req.body;
  const { password } = req.body;
  try {
    const userData = await knex("users").select("*").where({ email: email });
    let hash;
    if (userData.length > 0) {
      let correct = await new Promise((resolve, reject) => {
        pbkdf2(
          password,
          '',//userData[0].id,
          100000,
          64,
          "sha512",
          async (err, derivedKey) => {
            if (err) throw err;
            hash = derivedKey.toString("hex");
            hash === userData[0].pass ? resolve(true) : resolve(false);
          }
        );
      });
      if (correct) {
        const token = fastify.jwt.sign(userData, { expiresIn: "24h" });
        reply.code(201).send({ message: `Successfull login!`, jwt: token });
      } else {
        reply.code(201).send({ message: `Wrong Username or password.` });
      }
    } else reply.code(201).send({ message: `Wrong Username or password.` });
  } catch (error) {
    reply.send(error);
  }
};

const loginUserByUsername = async (req, reply) => {  //login by username
  const { username } = req.body;
  const { password } = req.body;
  try {
    const userData = await knex("users").select("*").where({ username: username });
    let hash;
    if (userData.length > 0) {
      let correct = await new Promise((resolve, reject) => {
        pbkdf2(
          password,
          '',//userData[0].id,
          100000,
          64,
          "sha512",
          async (err, derivedKey) => {
            if (err) throw err;
            hash = derivedKey.toString("hex");
            hash === userData[0].pass ? resolve(true) : resolve(false);
          }
        );
      });
      if (correct) {
        const token = fastify.jwt.sign(userData, { expiresIn: "24h" });
        reply.code(201).send({ message: `Successfull login!`, jwt: token });
      } else {
        reply.code(201).send({ message: `Wrong Username or password.` });
      }
    } else reply.code(201).send({ message: `Wrong Username or password.` });
  } catch (error) {
    reply.send(error);
  }
};

const checkAuth = async (request, reply) => {  //checkAuth
  reply.send(request.user);
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  deleteUserById,
  deleteUserByEmail,
  deleteUserByUsername,
  updateUserById,
  loginUserByEmail,
  loginUserByUsername,
  getUserByEmail,
  checkAuth,
};
