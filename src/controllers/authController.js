const bcrypt = require('bcrypt');
const db = require('../../config/db');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const generateToken = require('../middleware/generateToken'); // Import the token generation function


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
      const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

      if (results.length === 0) {
          res.status(401).json({ success: false, message: 'Invalid credentials' });
          return;
      }

      const user = new User(results[0].id);
      const storedHashedPassword = results[0].password;

      const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);

      if (isPasswordValid) {
          const token = generateToken(results[0].id); // Generate token using user ID
          res.json({ success: true, user, token }); // Send token along with user data
      } else {
          res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  } catch (error) {
      console.error('Database Query Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username or email already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

    if (existingUsers.length > 0) {
      res.status(400).json({ success: false, message: 'Username or email already exists' });
      return;
    }

    // Hash the password before inserting into the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User into the Database
    const [result] = await db.query('INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [username, email, hashedPassword]);

    const newUser = new User(result.insertId);
    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Database Query Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
