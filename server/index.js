const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

const AuthController = require("./controllers/AuthController");
const CaretakerController = require("./controllers/CaretakerController");
const { end, query } = require("./db");
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
    res.status(500).json("Error");
    console.error(error.message);
  }
});

// get summary petdays of all caretakers
app.get("/caretakers/workdays", CaretakerController.getAllCaretakersPetDays);

//get expected salary within a certain date range(expecting a month range)
app.get("/caretakers/salary", CaretakerController.getAllCaretakersSalary);

// get combined available caretakers -> daterange, name, pet category
app.get(
  "/caretakers/availability/search",
  CaretakerController.searchAvailability
);

// get all availability for a given pet catagory
app.get(
  "/caretakers/availability/:category_name",
  CaretakerController.getAvailabilityByPetType
);

// get user by id
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
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

app.post("/pet-owners/bid/review", async (req, res) => {
  try {
    const {
      pet_owner_user_id,
      pet_name,
      start_date,
      end_date,
      care_taker_user_id,
      rating,
      review,
    } = req.body;
    await pool.query(
      `UPDATE bid
    SET rating = $1, review = $2 
    WHERE care_taker_user_id = $3 
    AND start_date = $4
    AND end_date = $5
    AND pet_owner_user_id = $6
    AND pet_name = $7`,
      [
        rating,
        review,
        care_taker_user_id,
        start_date,
        end_date,
        pet_owner_user_id,
        pet_name,
      ]
    );
    const bid = await pool.query(
      `SELECT * FROM bid WHERE care_taker_user_id = $1
      AND start_date = $2
      AND end_date = $3
      AND pet_owner_user_id = $4
      AND pet_name = $5`,
      [care_taker_user_id, start_date, end_date, pet_owner_user_id, pet_name]
    );
    console.log(bid.rows);
    if (bid.rowCount != 1) {
      res.status(400).json("Invalid query");
    }
    res.status(200).json(bid.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

app.post("/pet-owners/pets", PetOwnerController.createPet);

app.post("/pet-owners/bid", PetOwnerController.createBid);
// get all bids for a pet owner
app.get("/pet-owners/:pet_owner_user_id/bid", PetOwnerController.getAllBids);

// view all pets owned by a certain pet owner
app.get("/pet-owners/:pet_owner_user_id/pets", PetOwnerController.getAllPets);

// view all pets owned by a certain pet owner
app.get(
  "/pet-owners/:pet_owner_user_id/pets-without-userinfo",
  PetOwnerController.getAllPetsWithoutUserInfo
);

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

//Get current number of pets taken by caretaker with UID for date range
app.get(
  "/caretakers/:care_taker_user_id/pet-care-count/:start_date/:end_date",
  CaretakerController.getNumberTakenCarePets
);

// Average Satisfaction Per Pet Category
app.get(
  "/caretakers/categories/satisfaction/:month",
  CaretakerController.getAverageSatisfactionPerCategory
);

// Month with highest number of jobs -> highest number of petdays
app.get(
  "/caretakers/highest-pet-care-month",
  CaretakerController.getHighestPetDaysMonth
);

//Underperforming Fulltime Care Takers ( months) -> Number of Pet Days < 60 or average rating < 2.5
app.get(
  "/caretakers/under-performing/:month",
  CaretakerController.getUnderPerformingCaretakers
);

// Total number of Pet taken care of in the month.
app.get(
  "/caretakers/total-pet-care-by-month",
  CaretakerController.getTotalPetByMonth
);

//Get average rating of a caretaker
app.get(
  "/caretakers/:care_taker_user_id/average-rating",
  CaretakerController.getAverageRatingCaretaker
);

// caretaker input availability for part-time
// takes leave for full-time
app.post("/caretakers/availability", CaretakerController.specifyAvailability);
app.get("/caretakers/earnings", CaretakerController.getEarnings);

app.get("/categories", async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categories");
    res.status(200).json(categories.rows);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log("server listening at 5000");
});
