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
app.put("/pets/:user_id/:catname/:petname", async (req, res) => {
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

//get expected salary within a certain date range(expecting a month range)
app.get("/caretakers/salary/", async (req, res) => {
  try {
    let start = req.query.start
    let end = req.query.end
    // in order to ensure sql input is null
    start = start ? start : null
    end = end ? end : null
    console.log(start, end)
    const expectedSalary = await pool.query(
      `with RECURSIVE t as (
        select care_taker_user_id, start_date, end_date, 1 as index, (end_date - start_date + 1) as date_count, 
      (total_price/A.date_count) as daily_price
        from (select care_taker_user_id, start_date,end_date,(end_date - start_date + 1) as date_count, total_price from bid) as A
        where start_date >= (SELECT COALESCE(CAST($1 as date), DATE('1970-01-01')))
        AND start_date <= (SELECT COALESCE(CAST($2 as date), DATE('9999-12-31') ))
          union all
        select care_taker_user_id, start_date, end_date, index + 1, date_count, daily_price
        from t
        where index < date_count
      )
    SELECT care_taker_user_id, count(*) as pet_day, sum(t.daily_price) as total_earnings,
       (SELECT sum(daily_price)
      FROM (SELECT *,
        rank() OVER (
        PARTITION BY care_taker_user_id
        ORDER BY care_taker_user_id, start_date, end_date, index ASC)
        FROM t) as t2
      WHERE rank > 60
      AND t.care_taker_user_id = t2.care_taker_user_id
      ) as post_60_days_earnings, caretakers.is_full_time,
      (CASE WHEN caretakers.base_salary IS NULL AND caretakers.is_full_time = false
          THEN sum(t.daily_price) * caretakers.commission_rate -- parttimers
           WHEN count(*) > 60 THEN (SELECT sum(daily_price)
      FROM (SELECT *,
        rank() OVER (
        PARTITION BY care_taker_user_id
        ORDER BY care_taker_user_id, start_date, end_date, index ASC)
        FROM t) as t2
      WHERE rank > 60
      AND t.care_taker_user_id = t2.care_taker_user_id
      ) * caretakers.commission_rate + caretakers.base_salary
       ELSE caretakers.base_salary
       END) as salary
    FROM t JOIN caretakers ON t.care_taker_user_id = caretakers.user_id
    GROUP BY t.care_taker_user_id, caretakers.is_full_time, caretakers.base_salary, caretakers.commission_rate;`, [start, end]
    );
    res.status(200).json(expectedSalary);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Error")
  }
});

// get combined available caretakers -> daterange, name, pet category
app.get("/available/", async (req, res) => {
  try {
    let name = req.query.name
    let start = req.query.start
    let end = req.query.end
    let category = req.query.category
    let price = req.query.price
    let rating = req.query.rating
    //validate inputs
    name = name ? name : null
    start = start ? start : null
    end = end ? end : null
    category = category ? category : null
    price = price ? price : null
    rating = rating ? rating : null
    console.log( name ,start, end, category, rating)
    const findAvailable = await pool.query(
      `SELECT DISTINCT x.* , ROUND(AVG(y.avg_rating), 2)
      FROM (SELECT DISTINCT u.user_id as userid,
      u.name as named,
      u.contact_number as contact,
      c.daily_price as price,
      c.category_name as category
      FROM isAvailableOn a
      JOIN Users u ON a.care_taker_user_id = u.user_id
      JOIN CanTakeCare c ON a.care_taker_user_id = c.care_taker_user_id
      WHERE c.category_name LIKE COALESCE(CAST($1 as VARCHAR), '')||'%'
      AND a.available_date > COALESCE(CAST($2 AS DATE), DATE('1970-01-01'))
      AND a.available_date <= COALESCE(CAST($3 AS DATE), '9999-12-31')
      AND u.name LIKE COALESCE(CAST($4 as VARCHAR), '')||'%' 
      AND c.daily_price <= COALESCE(CAST($5 as INT), 20000)
         ) as x
      LEFT OUTER JOIN (SELECT u.user_id as userid,
      u.name as named, u.contact_number as contact,
      ROUND(AVG(b.rating), 2) as avg_rating
      FROM Bid b INNER JOIN Users u ON b.care_taker_user_id = u.user_id
      GROUP BY (u.user_id, b.care_taker_user_id, u.name, u.contact_number)) as y ON
      x.userid = y.userid 
      GROUP BY (x.userid, x.named, x.contact, x.price, y.userid, y.named, y.contact, x.category)
      HAVING AVG(y.avg_rating) >= COALESCE(CAST($6 AS NUMERIC), 0) OR AVG(y.avg_rating) IS NULL`
      , [category, start, end, name, price ,rating]
      );
      // console.log(findAvailable);
      res.status(200).json(findAvailable.rows);
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
        `SELECT DISTINCT u.user_id as userid, u.name as name, u.contact_number as contact, c.daily_price as price FROM 
        isAvailableOn a INNER JOIN Users u ON a.care_taker_user_id = u.user_id INNER JOIN CanTakeCare c 
        ON a.care_taker_user_id = c.care_taker_user_id WHERE c.category_name = $1`, [petType]
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