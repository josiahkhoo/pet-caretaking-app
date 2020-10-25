const pool = require("../db");
const moment = require("moment");
const { end } = require("../db");

// Helper function
// Returns the dates in between @startDate and @stopDate (inclusive)
function getDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate, "YYYY-MM-DD");
  var stopDate = moment(stopDate, "YYYY-MM-DD");
  while (currentDate <= stopDate) {
    dateArray.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "days");
  }
  return dateArray;
}

module.exports = {
  async specifyAvailablity(req, res) {
    try {
      //   const { id } = req.params;
      // TODO: do not allow leave if currently taking care of pets
      const { user_id, start_date, end_date } = req.body;
      const result = await pool.query(
        `SELECT is_full_time FROM caretakers WHERE user_id = $1 `,
        [user_id]
      );

      is_part_time = !result.rows[0].is_full_time;
      const enumeratedDates = getDates(start_date, end_date);
      for (var i = 0; i < enumeratedDates.length; i++) {
        const date = enumeratedDates[i];
        if (is_part_time) {
          // Check if date exists before insertion
          const dateExists = (
            await pool.query(
              `SELECT count(*) FROM isavailableon WHERE available_date = (SELECT CAST($1 as date))`,
              [date]
            )
          ).rows[0].count;

          if (dateExists == 1) {
            continue;
          }
          const result = await pool.query(
            `INSERT INTO isavailableon(care_taker_user_id, available_date) VALUES($1, $2) `,
            [user_id, date]
          );
        } else {
          // Deletion of non-existing date does not result in error
          const result = await pool.query(
            `DELETE FROM isavailableon WHERE care_taker_user_id = $1 AND available_date = $2`,
            [user_id, date]
          );
        }
      }

      res.status(200).json({
        user_id: user_id,
        start_date: start_date,
        end_date: end_date,
        is_full_time: !is_part_time,
      });
    } catch (error) {
      res.status(500).json("Error");
      console.error(error.message);
    }
  },

  async getEarnings(req, res) {
    try {
      //   const { id } = req.params;
      const { start_date, end_date } = req.body;
      const queryResult = await pool.query(
        `with RECURSIVE t as (
                  select care_taker_user_id, start_date, end_date, 1 as index, (end_date - start_date + 1) as date_count, 
              (total_price/A.date_count) as daily_price
                  from (select care_taker_user_id, start_date,end_date,(end_date - start_date + 1) as date_count, total_price from bid) as A
                  where start_date >= (SELECT CAST($1 as date))
                  AND start_date <= (SELECT CAST($2 as date))
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
              ) as post_60_days_earnings, caretakers.is_full_time
            FROM t JOIN caretakers ON t.care_taker_user_id = caretakers.user_id
            GROUP BY t.care_taker_user_id, caretakers.is_full_time;`,
        [start_date, end_date]
      );
      // console.log();

      // var earnings;
      // if result

      res.status(200).json(queryResult.rows);
    } catch (error) {
      res.status(500).json("Error");
      console.error(error.message);
    }
  },

  async getNumberTakenCarePets(req, res) {
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
  },

  async getAverageSatisfactionPerCategory(req, res) {
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
  },

  async getHighestPetDaysMonth(req, res) {
    try {
      const highest = await pool.query(
        "SELECT extract(MONTH FROM end_date) AS month, sum(end_date - start_date + 1) AS petdays FROM bid GROUP BY " +
          "extract(MONTH FROM end_date) ORDER by petdays DESC LIMIT 1"
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
  },

  async getTotalPetMonth(req, res) {
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
  },

  async addCanTakeCareOf(req, res) {
    try {
      const { uid, category, price } = req.params;
      const canTakeCare = await pool.query(
        "INSERT INTO cantakecare VALUES($1, $2, $3)",
        [uid, category, price]
      );
      res.json("Category updated");
    } catch (error) {
      res.status(500);
      console.error(error.message);
    }
  },
};
