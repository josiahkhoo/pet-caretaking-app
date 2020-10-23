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

// get people with average ratings > k
app.get("/bid/:rating", async (req, res) => {
  try {
    const { rating } = req.params;
    const caretakerRating = await pool.query(`SELECT u.name as name,
    u.contact_number as contact,
    ROUND(AVG(b.rating), 2) as avg_rating
    FROM Bid b INNER JOIN Users u
    ON b.care_taker_user_id = u.user_id
    GROUP BY (b.care_taker_user_id, u.name, u.contact_number)
    HAVING AVG(b.rating) > ${rating}
    ORDER BY AVG(b.rating) DESC`);
    console.log(caretakerRating);
    res.json(caretakerRating.rows);
  } catch (error) {
    console.error("fail");
    console.error(error.message);
  }
});

// get summary petdays of all caretakers
app.get("/admin/:workdays", async (req, res) => {
  try {
    const petDays = await pool.query(`SELECT b.care_taker_user_id , u.name as name,
    SUM (CASE
       WHEN b.start_date != b.end_date
       THEN b.end_date - b.start_date + 1
       ELSE 1
       END)
      AS petdays
  FROM Bid b
  INNER JOIN Users u ON b.care_taker_user_id = u.user_id
  GROUP BY (b.care_taker_user_id, u.name)
  ORDER BY petdays DESC`);
    console.log(petDays);
    res.json(petDays.rows);
  } catch (error) {
    console.error("fail");
    console.error(error.message);
  }
});

//insert into ownedpets
app.put("/pets/:newpet", async (req, res) => {
  try{
    const { pet_owner_user_id, category_name, pet_name } = req.params;
    console.log(pet_owner_user_id, category_name, pet_name)
    const insertPet = await pool.query(
      `INSERT INTO OwnedPets (${pet_owner_user_id}, ${category_name}, ${pet_name})`
    );
  } catch (error) {
    console.error(error.message);
  }
});

// get available dates of between a given interval
app.get("/available/:daterange", async (req, res) => {
  try{
    const { start_date, end_date } = req.params;
    console.log(start_date, end_date)
    const findAvailableInterval = await pool.query(`
    SELECT u.user_id as userid, 
            u.name as name, 
            u.contact_number as contact,
            c.daily_price as price
    FROM isAvailableOn a 
    INNER JOIN Users u ON a.care_taker_user_id = u.user_id 
    INNER JOIN CanTakeCare c ON a.care_taker_user_id = c.care_taker_user_id
    WHERE (a.available_date > ${start_date} AND a.available_date <= ${end_date})`
    );
    console.log(findAvailableInterval);
    res.json(findAvailableInterval.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// get all availability for a given carer name
app.get("/available/:name", async (req, res) => {
  try{
    const { caretakerName } = req.params;
    console.log(caretakerName)
    const findAvailableName = await pool.query(`
    SELECT u.user_id as userid,
        u.name as name,
        u.contact_number as contact,
        c.daily_price as price
    FROM isAvailableOn a 
    INNER JOIN Users u ON a.care_taker_user_id = u.user_id 
    INNER JOIN CanTakeCare c ON a.care_taker_user_id = c.care_taker_user_id
    WHERE u.name = ${caretakerName}`)
    console.log(findAvailableName);
    res.json(findAvailableName.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// get all availability for a given pet catagory
app.get("/available/:petcategory", async (req, res) => {
  try{
    const { petType } = req.params;
    console.log(petType)
    const findAvailablePetType = await pool.query(`
    SELECT u.user_id as userid,
        u.name as name,
        u.contact_number as contact,
        c.daily_price as price
    FROM isAvailableOn a
    INNER JOIN Users u ON a.care_taker_user_id = u.user_id
    INNER JOIN CanTakeCare c ON a.care_taker_user_id = c.care_taker_user_id
    WHERE c.category_name = ${petType}`)
    console.log(findAvailablePetType);
    res.json(findAvailablePetType.rows);
  } catch (error) {
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