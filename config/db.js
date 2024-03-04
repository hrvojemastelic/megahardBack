// db.js

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'linuxlite',
  password: '0000',
  database: 'megahard_DB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 1000
});

module.exports = pool.promise(); // Using promises for async/await support

// Example: Select all users
/*pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log('Users:', results);
  });*/