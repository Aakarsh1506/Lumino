const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("./db");

const app = express();

// ================= CORS =================

app.use(cors());

app.use(express.json());

// ================= TEST ROUTE =================

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend working",
  });
});
app.get("/db-test", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) {
      console.log("DB TEST ERROR:", err);

      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: "Database connected successfully",
    });
  });
});

// ================= SIGNUP =================

app.post("/signup", async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      phone,
      password,
    } = req.body;

    if (!fullName || !username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // CHECK IF USER EXISTS

    const checkUserSql = `
      SELECT * FROM users
      WHERE email = ? OR username = ?
    `;

    db.query(
      checkUserSql,
      [email, username],
      async (checkErr, checkResult) => {
        if (checkErr) {
          console.log("CHECK USER ERROR:", checkErr);

          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        if (checkResult.length > 0) {
          return res.status(400).json({
            success: false,
            message: "User already exists",
          });
        }

        // HASH PASSWORD

        const hashedPassword = await bcrypt.hash(password, 10);

        // INSERT USER

        const insertSql = `
          INSERT INTO users
          (full_name, username, email, phone, password)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            fullName,
            username,
            email,
            phone,
            hashedPassword,
          ],
          (insertErr, result) => {
            if (insertErr) {
              console.log("SIGNUP ERROR:", insertErr);

              return res.status(500).json({
                success: false,
                message: "Signup failed",
              });
            }

            res.json({
              success: true,
              message: "Signup successful",
            });
          }
        );
      }
    );
  } catch (error) {
    console.log("SERVER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= LOGIN =================

app.post("/login", (req, res) => {
  const { identifier, password } = req.body;

  const sql = `
    SELECT * FROM users
    WHERE email = ? OR username = ?
  `;

  db.query(sql, [identifier, identifier], async (err, results) => {
    if (err) {
      console.log("LOGIN ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  });
});

// ================= USERS ROUTE =================

app.get("/users", (req, res) => {
  const sql = `
    SELECT
      id,
      full_name,
      username,
      email,
      phone,
      created_at
    FROM users
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log("USERS ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json(results);
  });
});

// ================= START SERVER =================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});