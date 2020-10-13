const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

// Routes

// create users
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *",
      [email, password]
    );

    res.json(newUser.rows[0]);
    console.log(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query(
      "SELECT * FROM Users WHERE username=$1 AND password=$2",
      [username, password]
    );
    if (user.rows.length == 1) {
      res.status(200).json(user.rows[0]);
    } else {
      res.status(400).send("Invalid user details");
    }
    console.log(user.rows[0]);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    console.log(allUsers);
    res.json(allUsers.rows);
  } catch (error) {
    console.error("fail");
    console.error(error.message);
  }
});

// get user by id
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(`SELECT * FROM users WHERE user_id = ${id}`);
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// update password
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    console.log(id, description);

    const updatedUser = await pool.query(
      `UPDATE users SET password = $1 WHERE user_id = $2`,
      [password, id]
    );

    res.json("User updated");
  } catch (error) {
    console.error("error", error.message);
  }
});

// delete
app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await pool.query(
      `DELETE FROM users WHERE user_id = $1`,
      [id]
    );
    res.json("User deleted");
  } catch (error) {
    console.error("error", error.message);
  }
});

app.listen(5000, () => {
  console.log("server listening at 5000");
});
