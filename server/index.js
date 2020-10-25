const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

const AuthController = require("./controllers/AuthController");
const CaretakerController = require("./controllers/CaretakerController");
const { end } = require("./db");
const {
  addCanTakeCareOf,
  fullTimeCareTakerTakeLeave,
  getAllBids,
} = require("./controllers/CaretakerController");
const { viewReviews } = require("./controllers/PetOwnerController");
const PetOwnerController = require("./controllers/PetOwnerController");
// Routes

// User
app.post("/register", AuthController.register);
app.post("/login", AuthController.login);

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
// View reviews from a PetOwner for a pet category
app.get(
  "/pet-owners/:pet_owner_user_id/categories/:category_name/reviews",
  PetOwnerController.viewGivenReviews
);

app.get(
  "/pet-owners/:pet_owner_user_id/pets/:pet_name/bid",
  PetOwnerController.getBidsByPets
);

app.post("/pet-owners/bid/", PetOwnerController.createBid);
// get all bids for a pet owner
app.get("/pet-owners/:pet_owner_user_id/bid", PetOwnerController.getAllBids);

// view all pets owned by a certain pet owner
app.get("/pet-owners/:pet_owner_user_id/pets", PetOwnerController.getAllPets);

// get all bids for a caretaker
app.get("/caretakers/:care_taker_user_id/bid", CaretakerController.getAllBids);

// confirm a bid for a part-time caretaker (specify price)
app.post(
  "/caretakers/part-time/bid/confirm",
  CaretakerController.partTimeCareTakerBidConfirm
);
// specify categories that CT can take care
app.post("/caretakers/categories/", CaretakerController.addCanTakeCareOf);

// delete is available on for full time caretaker (taking leave)
// constraints are enforced in DB trigger
app.post(
  "/caretakers/full-time/leave",
  CaretakerController.fullTimeCareTakerTakeLeave
);

// caretaker input availability for part-time
// takes leave for full-time
app.post("/caretakers/availability", CaretakerController.specifyAvailablity);
app.get("/caretakers/earnings", CaretakerController.getEarnings);

app.listen(5000, () => {
  console.log("server listening at 5000");
});
