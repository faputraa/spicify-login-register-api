const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: '34.101.216.35',
  user: 'root',
  password: '5231',
  database: 'spicify_logreg',
});

function createUser(user, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
      return;
    }

    const insertUserQuery = `
      INSERT INTO users (username, email, password, date)
      VALUES (?, ?, ?, ?)
    `;
    
    const values = [user.username, user.email, user.password, new Date()];

    connection.query(insertUserQuery, values, (err, results) => {
      connection.release(); // Release the connection

      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          callback(new Error('Email already in use.'));
        } else {
          callback(err);
        }
      } else {
        callback(null, results.insertId); // Callback with the inserted user ID
      }
    });
  });
}

// Example usage:
const user = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123',
};

createUser(user, (err, insertedUserId) => {
  if (err) {
    console.error('Error creating user:', err.message || err);
  } else {
    console.log(`User inserted with ID: ${insertedUserId}`);
  }
});