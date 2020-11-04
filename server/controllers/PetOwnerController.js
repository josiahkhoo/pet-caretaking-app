const pool = require("../db");
const moment = require("moment");

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
      const { pet_owner_user_id, category_name } = req.params;
      const reviews = await pool.query(
        "SELECT r.review FROM review r WHERE r.username = $1 AND r.category_name = $2;",
        [pet_owner_user_id, category_name]
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
      const { pet_owner_user_id } = req.params;
      const pets = await pool.query(
        "SELECT p.owner, p.pname, p.bio, p.pic FROM petownerpets p WHERE p.id = $1;",
        [pet_owner_user_id]
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

  async getPet(req, res) {
    try {
      const { pet_owner_user_id, pet_name } = req.params;
      const pets = await pool.query(
        "SELECT * FROM ownedpets p WHERE p.pet_owner_user_id = $1 AND p.pet_name = $2;",
        [pet_owner_user_id, pet_name]
      );
      if (pets.rows) {
        if (pets.rowCount !== 1) {
          res.json("No pets or invalid id");
        } else {
          res.status(200).json(pets.rows[0]);
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

  async getAllPetsWithoutUserInfo(req, res) {
    try {
      const { pet_owner_user_id } = req.params;
      const pets = await pool.query(
        "SELECT * FROM OwnedPets p WHERE p.pet_owner_user_id = $1;",
        [pet_owner_user_id]
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
      res.status(500).json([]);
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
        `SELECT Bid.care_taker_user_id AS care_taker_user_id, 
        Users.name AS care_taker_name, 
        Bid.pet_owner_user_id AS pet_owner_user_id,
        Bid.pet_name AS pet_name, 
        Bid.is_success AS is_success, 
        Bid.payment_type AS payment_type,
        Bid.transfer_type AS transfer_type,
        Bid.total_price AS total_price,
        Bid.review AS review,
        Bid.rating AS rating,
        Bid.start_date AS start_date,
        Bid.end_date AS end_date
         FROM Bid LEFT JOIN Users ON Bid.care_taker_user_id = Users.user_id WHERE Bid.pet_owner_user_id = $1`,
        [pet_owner_user_id]
      );
      res.status(200).json(bids.rows);
    } catch (error) {
      console.error("error", error.message);
      res.status(400).json(error.message);
    }
  },

  async createPet(req, res) {
    try {
      const {
        pet_owner_user_id,
        pet_name,
        category_name,
        special_requirements,
        image_url,
      } = req.body;
      await pool.query(
        `INSERT INTO OwnedPets(pet_owner_user_id, pet_name, category_name, special_requirements, image_url) VALUES ($1, $2, $3, $4, $5)`,
        [
          pet_owner_user_id,
          pet_name,
          category_name,
          special_requirements,
          image_url,
        ]
      );
      pet = await pool.query(
        `SELECT * FROM OwnedPets WHERE pet_owner_user_id = $1 AND pet_name = $2`,
        [pet_owner_user_id, pet_name]
      );
      if (pet.rowCount != 1) {
        res.status(400).json("Invalid query");
      }
      res.status(200).json(pet.rows[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
    }
  },

  async updatePet(req, res) {
    try {
      const { pet_owner_user_id, pet_name } = req.params;
      const { special_requirements, image_url } = req.body;
      await pool.query(
        `UPDATE OwnedPets SET special_requirements = $1, image_url = $2 WHERE pet_owner_user_id = $3 AND pet_name = $4`,
        [special_requirements, image_url, pet_owner_user_id, pet_name]
      );
      pet = await pool.query(
        `SELECT * FROM OwnedPets WHERE pet_owner_user_id = $1 AND pet_name = $2`,
        [pet_owner_user_id, pet_name]
      );
      if (pet.rowCount != 1) {
        res.status(400).json("Invalid query");
      }
      res.status(200).json(pet.rows[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
    }
  },
};
