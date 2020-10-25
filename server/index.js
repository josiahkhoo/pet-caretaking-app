const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

const AuthController = require("./controllers/AuthController");
const CaretakerController = require("./controllers/CaretakerController");
const { end } = require("./db");
const { addCanTakeCareOf } = require("./controllers/CaretakerController");
const { viewReviews } = require("./controllers/PetOwnerController");
const PetOwnerController = require("./controllers/PetOwnerController");
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

//Get current number of pets taken by caretaker with UID for date range
app.get(
  "/caretaker/:uid/:start_date/:end_date",
  CaretakerController.getNumberTakenCarePets
);

// Average Satisfaction Per Pet Category
app.get(
  "/satisfaction/:month",
  CaretakerController.getAverageSatisfactionPerCategory
);

// Month with highest number of jobs -> highest number of petdays
app.get("/highestPetDaysMonth", CaretakerController.getHighestPetDaysMonth);

// Total number of Pet taken care of in the month.
app.get("/totalPet/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const totalPet = await pool.query(
      "SELECT COUNT(*) FROM bid WHERE EXTRACT(MONTH FROM end_date) = $1 AND is_success = TRUE",
      [month]
    );
    if (totalPet.rows.length == 1) {
      res.status(200).json(totalPet.rows[0]);
    } else {
      res.status(400).send("Invalid user id or date range");
    }
    console.log(totalPet.rows[0]);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

// specify categories that CT can take care
app.post(
  "/petCategory/:uid/:category/:price",
  CaretakerController.addCanTakeCareOf
);

// view all pets owned by a certain pet owner
app.get("/allPets/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const pets = await pool.query(
      "SELECT p.owner, p.pname, p.bio, p.pic FROM petownerpets p WHERE p.id = $1;",
      [uid]
    );
    if (pets.rows) {
      if (pets.rowCount == 0) {
        res.json("No pets or invalid id");
      } else {
        res.status(200).json(pets.rows);
      }
    } else {
      res.status(400).send("Invalid user id");
    }
    console.log(pets.rows);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

// View reviews from a PetOwner for a pet category
app.get("/reviews/:owner/:category", PetOwnerController.viewGivenReviews);

app.get(
  "/pet-owner/bid/:pet_owner_user_id/:pet_name",
  PetOwnerController.getBidsByPets
);

app.post("/pet-owner/bid/", PetOwnerController.createBid);

app.get("/caretaker/bid");

app.listen(5000, () => {
  console.log("server listening at 5000");
});
