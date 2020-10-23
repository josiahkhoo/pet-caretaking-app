const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

const AuthController = require("./controllers/AuthController");
const CaretakerController = require("./controllers/CaretakerController");
const { end } = require("./db");
// Routes

// User
app.post("/register", AuthController.register);
app.post("/login", AuthController.login);

// caretaker input availability for part-time
// takes leave for full-time
app.post("/caretakers/availability", CaretakerController.specifyAvailablity);
app.get("/caretakers/earnings", CaretakerController.getEarnings);

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

app.get("/pet-owner/bid/:pet_owner_user_id/:pet_name", async (req, res) => {
  try {
    const { pet_owner_user_id, pet_name } = req.params;
    const bids = await pool.query(
      `SELECT * FROM Bid WHERE pet_owner_user_id = $1 AND pet_name = $2`,
      [pet_owner_user_id, pet_name]
    );
    res.status(200).json(bids.rows);
  } catch (error) {
    console.error("error", error.message);
    res.status(400).json(error.message);
  }
});

app.post("/pet-owner/bid/", async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      pet_owner_user_id,
      care_taker_user_id,
      pet_name,
      payment_type,
      transfer_type,
    } = req.body;
    const bid = await pool.query(
      `INSERT INTO Bid (
        care_taker_user_id,
        start_date,
        end_date,
        pet_owner_user_id,
        pet_name,
        payment_type,
        transfer_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        care_taker_user_id,
        start_date,
        end_date,
        pet_owner_user_id,
        pet_name,
        payment_type,
        transfer_type,
      ]
    );
    res.status(200).json({
      care_taker_user_id: care_taker_user_id,
      pet_owner_user_id: pet_owner_user_id,
      pet_name: pet_name,
      start_date: start_date,
      end_date: end_date,
      payment_type: payment_type,
      transfer_type: transfer_type,
    });
  } catch (error) {
    console.error("error", error.message);
    res.status(400).json(error.message);
  }
});

app.get("/caretaker/bid");

app.listen(5000, () => {
  console.log("server listening at 5000");
});
