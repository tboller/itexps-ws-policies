const express = require("express");

const app = express();

app.use(express.json());

const users = [

  { id: 1, name: "Alice" },

  { id: 2, name: "Bob" },

];

// Define a GET request handler for the user resource

app.get("/users", (req, res) => {

  res.json(users);

});



// Define a POST request handler for the user resource

app.post("/users", (req, res) => {

  const { name } = req.body;

  const id = users.length + 1;

  users.push({ id, name });

  res.json({ id, name });

});



// Start the server

app.listen(3000, () => {

  console.log("Server listening on port 3000");

});