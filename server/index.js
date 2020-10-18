const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

const AuthController = require("./controllers/AuthController");
const CaretakerController = require("./controllers/CaretakerController");
// Routes

// User
app.post("/register", AuthController.register);
app.post("/login", AuthController.login);

// caretaker input availability for part-time
// takes leave for full-time
app.post("/caretakers/availability", CaretakerController.specifyAvailablity);


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