const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const db_config = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'login',
};

const pool = mysql.createPool(db_config);

// Create the 'users' table if it doesn't exist
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
  connection.query(
    'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL,phone VARCHAR(10) NOT NULL, password VARCHAR(100) NOT NULL)',
    (err, result) => {
      connection.release();
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Table created successfully.');
      }
    }
  );
});
// Middleware to parse request body as JSON
app.use(bodyParser.json());

const clientPath = path.join(__dirname, 'client');
app.use(express.static(clientPath));

// POST route to handle form submissions
app.post('/submit', (req, res) => {
  const formData = req.body;
  const { form_type } = formData;

  if (form_type === 'sign-up') {
    handleSignUp(formData, res);
  } else if (form_type === 'sign-in') {
    handleSignIn(formData, res);
  } else {
    res.status(400).send('Invalid form type.');
  }
});

// Function to handle sign-up form submission
function handleSignUp(formData, res) {
    const { name, email, phone, pwd1, repwd } = formData;
  
    // Check if all fields are provided
    if (!name) {
      res.status(400).send('Name is required.');
      return;
    }
    if (!email) {
      res.status(400).send('Email is required.');
      return;
    }
    if (!pwd1) {
      res.status(400).send('Password is required.');
      return;
    }
    if (!phone) {
        res.status(400).send('Password is required.');
        return;
    }
    if (!repwd) {
        res.status(400).send('Re-Enter Password is required.');
        return;
    }
    if (pwd1 !== repwd) {
        res.status(400).send('Passwords do not match. Please re-enter the same password.');
        return;
    }

  const hashedPassword = pwd1;

  // Database query to insert user data into the database
  const sql = 'INSERT INTO users (name, email,phone, password) VALUES (?, ?, ?, ?)';
  pool.query(sql, [name, email, phone, hashedPassword], (err, result) => {
    if (err) {
      res.status(500).send('Error storing data in the database.');
    } else {
      res.status(200).send('Sign Up successful!');
    }
  });
}

// Function to handle login form submission
function handleSignIn(formData, res) {
  const { email, pwd2 } = formData;

  // Perform basic validation
  if (!email) {
    res.status(400).send('Email is required.');
    return;
  }
  if (!pwd2) {
    res.status(400).send('Email is required.');
    return;
  }

  // Database query to check user login credentials
  const sql = 'SELECT * FROM users WHERE email = ?';
  pool.query(sql, [email], (err, results) => {
    if (err) {
      res.status(500).send('Error accessing the database.');
    } else {
      if (results.length === 0) {
        res.status(401).send('Invalid email or password.');
      } else {
        const user = results[0];
        if (user.password === pwd2) {
          res.status(200).send('Login successful!');
        } else {
          res.status(401).send('Invalid email or password.');
        }
      }
    }
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});