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
app.get("/caretaker/:uid/:start_date/:end_date", async (req, res) => {
  try {
    const { uid, start_date, end_date } = req.params;
    const petCount = await pool.query(
        "SELECT DISTINCT COUNT (*) FROM Bid WHERE is_success = TRUE AND start_date >= $2 AND end_date <= $3 " +
        "AND care_taker_user_id = $1 ",
        [uid, start_date, end_date]
    );
    if (petCount.rows.length == 1) {
      res.status(200).json(petCount.rows[0]);
    } else {
      res.status(400).send("Invalid user id or date range");
    }
    console.log(petCount.rows[0]);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

// Average Satisfaction Per Pet Category
app.get("/satisfaction/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const satisfaction = await pool.query(
        "SELECT category_name, AVG(rating) AS Satisfaction FROM bid NATURAL JOIN ownedpets WHERE " +
        "EXTRACT(MONTH FROM end_date) = $1 AND is_success = TRUE GROUP BY category_name ",
        [month]
    );
    if (satisfaction.rows) {
      res.status(200).json(satisfaction.rows);
    } else {
      res.status(400).send("Invalid user id or date range");
    }
    console.log(satisfaction.rows);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

// Month with highest number of jobs -> highest number of petdays
app.get("/highestPetDaysMonth", async (req, res) => {
  try {
    const highest = await pool.query(
        "SELECT extract(MONTH FROM end_date) AS month, sum(end_date - start_date + 1) AS petdays FROM bid GROUP BY " +
        "extract(MONTH FROM end_date) ORDER by petdays DESC LIMIT 1",
    );
    if (highest.rows.length == 1) {
      res.status(200).json(highest.rows[0]);
    } else {
      res.status(400).send("Invalid user id or date range");
    }
    console.log(highest.rows[0]);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

//Underperforming Fulltime Care Takers ( months) -> Number of Pet Days < 60 or average rating < 2.5
app.get("/underPerforming/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const underPerforming = await pool.query(
        "SELECT care_taker_user_id AS underperfoming FROM bid WHERE EXTRACT(MONTH FROM end_date) = $1 " +
        "AND is_success = TRUE GROUP BY care_taker_user_id HAVING (sum(end_date - start_date + 1) < 60 " +
        "OR AVG(rating) < 2.5)",
        [month]
    );
    if (underPerforming.rows) {
      res.status(200).json(underPerforming.rows);
    } else {
      res.status(400).send("Invalid user id or date range");
    }
    console.log(underPerforming.rows);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

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
app.post("/petCategory/:ctid/:category/:price", async (req, res) => {
  try {
    const { ctid, category, price } = req.params;
    const canTakeCare = await pool.query(
        "INSERT INTO cantakecare VALUES($1, $2, $3)",
        [ctid, category, price]
    );
    const categoryPrice = await pool.query(
      "SELECT * FROM cantakecare c WHERE c.care_taker_user_id = $1 AND c.category_name = $2",
      [ctid, category]
    );
    res.status(200).json(categoryPrice.rows);
  } catch (error) {
    res.status(400).json(error.message);
    console.error(error.message);
  }
});

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
app.get("/reviews/:owner/:category", async (req, res) => {
  try {
    const { owner, category } = req.params;
    const reviews = await pool.query(
        "SELECT r.review FROM review r WHERE r.username = $1 AND r.category_name = $2;",
        [owner, category]
    );
    if (reviews.rows) {
      if (reviews.rowCount == 0) {
        res.json("No pets or invalid id");
      } else {
        res.status(200).json(reviews.rows);
      }
    } else {
      res.status(400).send("Invalid user id");
    }
    console.log(reviews.rows);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});


app.listen(5000, () => {
  console.log("server listening at 5000");
});