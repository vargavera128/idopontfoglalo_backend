const {
    getUsers,
    getUserById,
    addUser,
    deleteUserById,
    updateUserById,
    loginUserByUsername,
    loginUserByEmail,
    getUserByEmail,
    checkAuth
  } = require("../controllers/user");
  const {fastify} = require("../index.js");
  
  
  const Item = {  // Struct for Item
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      username: {type: "string"},
      password: { type: "string" },
      created_at: { type: "string" },
      updated_at: { type: "string" },
      id: { type: "string" },
    },
  };
  
  
  const getItemsOpts = {  // Options for get all items
    schema: {
      description: "Get all users",
      response: {
        200: {
          type: "array",
          items: Item,
        },
      },
    },
    handler: getUsers,
    onRequest: [fastify.authenticate]
  };
  
  const getItemOpts = {  // Options for get one item
    schema: {
      description: "Get user by id",
      response: {
        200: Item,
      },
    },
    handler: getUserById,
    onRequest: [fastify.authenticate]
  };
  
  const postItemOpts = {  //Options for add item
    schema: {
      description: "Add a new user",
      body: {
        type: "object",
        properties: {        
          email: { type: "string" },
          pass: { type: "string" },
          username: { type: "string" },
          name: { type: "string" },
          //created_at: { type: "string" },
          //updated_at: { type: "string" },        
          //id: { type: "string" },
        },
        required: ['name', 'email', 'username', 'pass']
      },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        409: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: addUser,
    //onRequest: [fastify.authenticate]
  };
  
  const deleteItemOpts = {  //Options for Delete item
    schema: {
      description: "Delete user by id",
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: deleteUserById,
    onRequest: [fastify.authenticate]
  };
  
  const updateItemOpts = {  //Update one Item
    schema: {
      description: "Update user by id",
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: updateUserById,
    onRequest: [fastify.authenticate]
  };
  const loginUserOpts = {  //Login user by email
    schema: {
      description: "Login user by email",
      body: {
        type: "object",
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
        required: ['email', 'password']
      },
      response: {
        201: {
          type: "object",
          properties: {
            message: { type: "string" },
            jwt: { type: "string" },
          },
        },
      },
    },
    handler: loginUserByEmail,
  };
  
  const loginUserOptsUsername = {  //Login user by username
    schema: {
      description: "Login user by username",
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
        required: ['username', 'password']
      },
      response: {
        201: {
          type: "object",
          properties: {
            message: { type: "string" },
            jwt: { type: "string" },
          },
        },
      },
    },
    handler: loginUserByUsername,
  };
  
  const getUserOpts = {  //Option for get user by email
    schema: {
      description: "Get user by email",
      response: {
        200: Item,
      },
    },
    onRequest: [fastify.authenticate],
    handler: getUserByEmail,
    //onRequest: [fastify.authenticate],
  };
  
  const checkAuthOpts = {
    onRequest: [fastify.authenticate],
    handler: checkAuth,
  };
  
  function UserRoutes(fastify, options, done) {
    // Get all Users
    fastify.get("/user", getItemsOpts);
    // get one User
    fastify.get("/user/:id", getItemOpts);
    // get one user BY email
    fastify.get("/userEmail/:email", getUserOpts);
    // Add User
    fastify.post("/user", postItemOpts);
    // Delete User
    fastify.delete("/user/:id", deleteItemOpts);
    // Update User
    fastify.put("/user/:id", updateItemOpts);
    // Login
    fastify.post("/user/login", loginUserOpts);
    fastify.post("/user/loginUsername", loginUserOptsUsername)
    fastify.get("/checkAuth",checkAuthOpts)
  
    done();
  }
  module.exports = UserRoutes;
  