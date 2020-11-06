const pool = require("../db");

module.exports = {
  async register(req, res) {
    try {
      const {
        username,
        password,
        contact_number,
        name,
        address,
        is_pcs_admin,
        is_pet_owner,
        is_full_time_ct,
        is_part_time_ct,
      } = req.body;
      // Check if username exists in db
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE username=$1",
        [username]
      );
      if (existingUser.rows.length == 1) {
        console.log("Username taken");
        res
          .status(400)
          .json("Username is taken, please use a different username!");
        return;
      }
      console.log(
        username,
        password,
        contact_number,
        name,
        address,
        is_pcs_admin,
        is_pet_owner
      );
      // Insert user to users table
      const newUser = await pool.query(
        "INSERT INTO users(username, password, contact_number, name, address, is_pcs_admin, is_pet_owner) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          username,
          password,
          contact_number,
          name,
          address,
          is_pcs_admin,
          is_pet_owner,
        ]
      );
      console.log("User inserted into users table");
      // Insert user to caretakers table
      const userId = newUser.rows[0].user_id;

      if (is_part_time_ct) {
        const newCareTaker = await pool.query(
          "INSERT INTO caretakers(user_id, is_full_time, commission_rate) VALUES($1, $2, (SELECT MAX(part_time_commission_rate) FROM admin)) RETURNING *",
          [userId, is_full_time_ct]
        );
      } else if (is_full_time_ct) {
        const newCareTaker = await pool.query(
          "INSERT INTO caretakers(user_id, is_full_time, bonus_rate, base_salary, minimum_base_quota) VALUES($1, $2, (SELECT MAX(full_time_bonus_rate) FROM admin), (SELECT MAX(full_time_base_salary) FROM admin), (SELECT MAX(poor_review_pet_limit) FROM admin)) RETURNING *",
          [userId, is_full_time_ct]
        );
      }

      if (newUser.rows.length == 1) {
        res.status(200).json(newUser.rows[0]);
      } else {
        res.status(400).send("Registration failed");
      }
    } catch (error) {
      res.status(500);
      console.error(error.message);
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await pool.query(
        "SELECT users.user_id AS user_id, username, password, contact_number, name, is_pcs_admin, is_pet_owner, image_url, address, bonus_rate, base_salary, minimum_base_quota, commission_rate, is_full_time FROM users LEFT JOIN caretakers ON users.user_id = caretakers.user_id WHERE username=$1 AND password=$2",
        [username, password]
      );
      if (user.rows.length == 1) {
        res.status(200).json(user.rows[0]);
      } else {
        res.status(400).send("Invalid user details");
      }
      console.log(user.rows[0]);
    } catch (error) {
      res.status(500);
      console.error(error.message);
    }
  },

  async update(req, res) {
    try {
      const { user_id } = req.params;
      const { name, password, contact_number, address } = req.body;
      const update = await pool.query(
        "UPDATE users SET name = $2, password = $3, contact_number= $4, address = $5 WHERE user_id = $1 RETURNING *",
        [user_id, name, password, contact_number, address]
      );
      const user = await pool.query(
        "SELECT * FROM users LEFT JOIN caretakers ON users.user_id = caretakers.user_id WHERE users.user_id=$1",
        [user_id]
      );
      if (update.rows.length == 1 && user.rows.length == 1) {
        res.status(200).json(user.rows[0]);
      } else {
        res.status(400).send("Invalid user details");
      }
      console.log(user.rows[0]);
    } catch (error) {
      res.status(500);
      console.error(error.message);
    }
  },

  async delete(req, res) {
    try {
      const { user_id } = req.params;
      const deletedUser = await pool.query(
        `DELETE FROM users WHERE user_id = $1`,
        [user_id]
      );
      res.json("User deleted");
    } catch (error) {
      console.error("error", error.message);
    }
  },

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await pool.query(
        "SELECT * FROM users LEFT JOIN caretakers ON users.user_id = caretakers.user_id WHERE users.user_id = $1",
        [id]
      );
      if (user.rows.length == 1) {
        res.status(200).json(user.rows[0]);
      } else {
        res.status(400).send("Invalid user details");
      }
      console.log(user.rows[0]);
    } catch (error) {
      res.status(500);
      console.error(error.message);
    }
  },
};
