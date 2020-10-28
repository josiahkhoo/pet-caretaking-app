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
    res.status(500).json("Error");
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
    res.status(500).json("Error");
    console.error(error.message);
  }
});

//insert into ownedpets
app.put("/pets/:user_id:catname:petname", async (req, res) => {
  try{
    const { user_id, catname, petname } = req.params;
    console.log(user_id, catname, petname)
    const insertPet = await pool.query(
      "INSERT INTO OwnedPets ($1, $2, $3)",[user_id, catname, petname]
    );
  } catch (error) {
    res.status(500).json("Error");
    console.error(error.message);
  }
});

// get available dates of between a given interval
app.get("/available/:start:end", async (req, res) => {
  try{
    const { start, end } = req.params;
    console.log(start, end)
    const findAvailableInterval = await pool.query(
    "SELECT u.user_id as userid," +
    "u.name as name, " +
    "u.contact_number as contact," +
    "c.daily_price as price" +
    "FROM isAvailableOn a " +
    "INNER JOIN Users u ON a.care_taker_user_id = u.user_id " +
    "INNER JOIN CanTakeCare c ON a.care_taker_user_id = c.care_taker_user_id" +
    "WHERE (a.available_date > $1 AND a.available_date <= $2)",[start, end]
    );
    console.log(findAvailableInterval);
    res.json(findAvailableInterval.rows);
  } catch (error) {
    res.status(500).json("Error");
    console.error(error.message);
  }
});
// get combined available caretakers -> daterange, name, pet category
app.get("/available/:name/:start/:end/:category/:rating", async (req, res) => {
  try {
    const { name ,start, end, category, rating } = req.params
    console.log( name ,start, end, category, rating)
    // not sure how to validate inputs
    const findAvaliable = await pool.query(
      "SELECT x.* , ROUND(AVG(y.avg_rating), 2) "+
      "FROM (SELECT DISTINCT u.user_id as userid," +
      "u.name as named," +
      "u.contact_number as contact," +
      "c.daily_price as price" +
      "FROM isAvailableOn a " +
      "JOIN Users u ON a.care_taker_user_id = u.user_id" +
      "JOIN CanTakeCare c ON a.care_taker_user_id = c.care_taker_user_id " +
      "WHERE c.category_name LIKE COALESCE(CAST($1 as VARCHAR), '')||'%' " +
      "AND a.available_date > COALESCE(CAST($2 AS DATE), DATE('1970-01-01')) " +
      "AND a.available_date <= COALESCE(CAST($3 AS DATE), '9999-12-31') " +
      "AND u.name LIKE COALESCE(CAST($4 as VARCHAR), '')||'%') as x " +
      "LEFT OUTER JOIN (SELECT u.user_id as userid, " +
      "u.name as named, u.contact_number as contact," +
      "ROUND(AVG(b.rating), 2) as avg_rating" +
      "FROM Bid b INNER JOIN Users u ON b.care_taker_user_id = u.user_id" +
      "GROUP BY (u.user_id, b.care_taker_user_id, u.name, u.contact_number)) as y ON" +
      "x.userid = y.userid " +
      "GROUP BY (x.userid, x.named, x.contact, x.price, y.userid, y.named, y.contact)" +
      "HAVING AVG(y.avg_rating) >= COALESCE(CAST($5 AS NUMERIC), 0) OR AVG(y.avg_rating) IS NULL"
      , [category, start, end, name, rating]
      );
      console.log(findAvailable);
      res.json(findAvailable.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Error");
  }
});

// get all availability for a given carer name
app.get("/available/:name", async (req, res) => {
  try{
    const { caretakerName } = req.params;
    console.log(caretakerName)
    const findAvailableName = await pool.query(
    "SELECT u.user_id as userid," +
    "u.name as name," +
    "u.contact_number as contact," +
    "c.daily_price as price" +
    "FROM isAvailableOn a " +
    "INNER JOIN Users u ON a.care_taker_user_id = u.user_id" +
    "INNER JOIN CanTakeCare c ON a.care_taker_user_id = c.care_taker_user_id" +
    "WHERE u.name LIKE '$1%'", [caretakerName])
    console.log(findAvailableName);
    res.json(findAvailableName.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Error");
  }
});

// get all availability for a given pet catagory
app.get("/test/:petType", async (req, res) => {
  try {
    const { petType } = req.params;
    const avgRating = await pool.query(
        "SELECT DISTINCT u.user_id as userid, u.name as name, u.contact_number as contact, c.daily_price as price FROM " +
        "isAvailableOn a INNER JOIN Users u ON a.care_taker_user_id = u.user_id INNER JOIN CanTakeCare c " +
        "ON a.care_taker_user_id = c.care_taker_user_id WHERE c.category_name = $1", [petType]
    );
    if (avgRating.rows.length) {
      res.status(200).json(avgRating.rows);
    } else {
      res.status(400).send("Invalid caretaker id");
    }
    console.log(avgRating.rows);
  } catch (error) {
    res.status(500);
    console.error(error.message);
  }
});

// get user by id
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
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