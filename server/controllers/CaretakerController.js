const pool = require("../db");
const moment = require("moment");
const { end } = require("../db");

// Helper function
// Returns the dates in between @startDate and @stopDate (inclusive)
function getDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate, "DD-MM-YYYY");
  var stopDate = moment(stopDate, "DD-MM-YYYY");
  while (currentDate <= stopDate) {
      dateArray.push( currentDate.format('YYYY-MM-DD') )
      currentDate = currentDate.add(1, 'days');
  }
  return dateArray;
}

module.exports = {
  async specifyAvailablity(req, res) {
    try {
    //   const { id } = req.params;
      const { user_id, start_date, end_date } = req.body;
      const result = await pool.query(`SELECT is_full_time FROM caretakers WHERE user_id = $1 `,
      [user_id]);

      is_part_time = !result.rows[0].is_full_time;
      const enumeratedDates = getDates(start_date, end_date)
      for (var i = 0; i < enumeratedDates.length; i++) {
        const date = enumeratedDates[i];
        if (is_part_time) {
          // Check if date exists before insertion
          const dateExists = (await pool.query(`SELECT count(*) FROM isavailableon WHERE available_date = (SELECT CAST($1 as date))`, [date])).rows[0].count;

          if (dateExists == 1) {
            continue;
          }
          const result = await pool.query(`INSERT INTO isavailableon(care_taker_user_id, available_date) VALUES($1, $2) `,
          [user_id, date]);
        } else {
          // Deletion of non-existing date does not result in error
          const result = await pool.query(`DELETE FROM isavailableon WHERE care_taker_user_id = $1 AND available_date = $2`,
          [user_id, date]);
        }
      }

      res.status(200).json("Successfully declared availability");
    } catch (error) {
      res.status(500).json("Error");
      console.error(error.message);
    }
  }
}