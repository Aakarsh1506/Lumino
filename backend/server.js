const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("./db");

const app = express();

// ================= SIMPLE CORS =================

app.use(cors());

app.use(express.json());

// ================= TEST ROUTE =================

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend working",
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (full_name, username, email, phone, password)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        fullName,
        username,
        email,
        phone,
        hashedPassword,
      ],
      (err, result) => {
        if (err) {
          console.log("SIGNUP ERROR:", err);

          return res.status(500).json({
            success: false,
            message: "User already exists or database error",
          });
        }

        res.json({
          success: true,
          message: "Signup successful",
        });
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});