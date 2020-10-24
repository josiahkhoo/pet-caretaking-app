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

// get all bids for a certain pet from a pet owner
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

// get all bids for a pet owner
app.get("/pet-owner/bid/:pet_owner_user_id", async (req, res) => {
  try {
    const { pet_owner_user_id } = req.params;
    const bids = await pool.query(
      `SELECT * FROM Bid WHERE pet_owner_user_id = $1`,
      [pet_owner_user_id]
    );
    res.status(200).json(bids.rows);
  } catch (error) {
    console.error("error", error.message);
    res.status(400).json(error.message);
  }
});

// create a bid
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
    await pool.query(
      `INSERT INTO Bid (
        care_taker_user_id,
        start_date,
        end_date,
        pet_owner_user_id,
        pet_name,
        payment_type,
        transfer_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)

      `,
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
    const bid = await pool.query(
      `SELECT * 
      FROM Bid 
      WHERE care_taker_user_id = $1 
      AND start_date = $2 
      AND end_date = $3 
      AND pet_owner_user_id = $4 
      AND pet_name = $5`,
      [care_taker_user_id, start_date, end_date, pet_owner_user_id, pet_name]
    );
    res.status(200).json(bid.rows[0]);
  } catch (error) {
    console.error("error", error.message);
    res.status(400).json(error.message);
  }
});

// get all bids for a caretaker
app.get("/caretaker/bid/:care_taker_user_id", async (req, res) => {
  try {
    const { care_taker_user_id } = req.params;
    const bids = await pool.query(
      `SELECT * FROM Bid WHERE care_taker_user_id = $1`,
      [care_taker_user_id]
    );
    res.status(200).json(bids.rows);
  } catch (error) {
    console.error("error", error.message);
    res.status(400).json(error.message);
  }
});

// confirm a bid for a part-time caretaker (specify price)
app.post("/caretaker/part-time/bid/confirm", async (req, res) => {
  try {
    const {
      care_taker_user_id,
      start_date,
      end_date,
      pet_owner_user_id,
      pet_name,
    } = req.body;
    const bids = await pool.query(
      `UPDATE bid 
      SET is_success = TRUE
      WHERE care_taker_user_id = $2 
      AND start_date = $3
      AND end_date = $4
      AND pet_owner_user_id = $5
      AND pet_name = $6`,
      [care_taker_user_id, start_date, end_date, pet_owner_user_id, pet_name]
    );
    res.status(200).json({
      care_taker_user_id: care_taker_user_id,
      pet_owner_user_id: pet_owner_user_id,
      pet_name: pet_name,
      start_date: start_date,
      end_date: end_date,
    });
  } catch (error) {
    console.error("error", error.message);
    res.status(400).json(error.message);
  }
});

// insert is available on for part time caretaker
app.post("/caretaker/part-time/available", async (req, res) => {
  try {
    const { care_taker_user_id, available_date } = req.body;
    const isAvailableOn = await pool.query(
      `INSERT INTO 
      IsAvailableOn (care_taker_user_id, available_date)
      VALUES ($1, $2)`,
      [care_taker_user_id, available_date]
    );
    res.status(200).json({
      care_taker_user_id: care_taker_user_id,
      available_date: available_date,
    });
  } catch (error) {
    console.error("error", error.message);
    res.status(400).json(error.message);
  }
});

// delete is available on for full time caretaker (taking leave)
// constraints are enforced in DB trigger
app.post("/caretaker/full-time/leave", async (req, res) => {
  try {
    const { care_taker_user_id, available_date } = req.body;
    const isAvailableOn = await pool.query(
      `DELETE FROM IsAvailableOn WHERE care_taker_user_id = $1 AND available_date = $2`,
      [care_taker_user_id, available_date]
    );
    res.status(200).json({
      care_taker_user_id: care_taker_user_id,
      available_date: available_date,
    });
  } catch (error) {
    console.error("error", error.message);
    res.status(400).json(error.message);
  }
});

app.listen(5000, () => {
  console.log("server listening at 5000");
});
