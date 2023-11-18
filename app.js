const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'learning',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Middleware for role-based access control(RBAC)
const authorizeAdmin = (req, res, next) => {
    console.log('User:', req.body); // Assuming user information is in req.body
    const userRole = req.body && req.body.role;
  
    if (userRole === 'admin') {
      next();
    } else {
      console.log('Unauthorized request');
      res.status(403).json({ message: 'Unauthorized' });
    }
  };
  

// Route to add data (requires admin role)
app.post('/addData', authorizeAdmin, (req, res) => {
  // Assuming your request body contains the data to be added
  const data = req.body;

  // Insert data into MySQL
  const query = 'INSERT INTO machine SET ?';

  db.query(query, data, (err, results) => {
    if (err) {
      console.error('Error inserting data: ' + err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'Data added successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
