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
  async viewGivenReviews(req, res) {
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
  },

  async getBidsByPets(req, res) {
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
  },

  async getAllPets(req, res) {
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
  },

  async createBid(req, res) {
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
      const bid = await pool.query(
        `INSERT INTO Bid (
            care_taker_user_id,
            start_date,
            end_date,
            pet_owner_user_id,
            pet_name,
            payment_type,
            transfer_type
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
      res.status(200).json({
        care_taker_user_id: care_taker_user_id,
        pet_owner_user_id: pet_owner_user_id,
        pet_name: pet_name,
        start_date: start_date,
        end_date: end_date,
        payment_type: payment_type,
        transfer_type: transfer_type,
      });
    } catch (error) {
      console.error("error", error.message);
      res.status(400).json(error.message);
    }
  },

  async getAllBids(req, res) {
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
  },
};
