const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const cors = require('cors');


const app = express();

// Serve Angular application from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

app.use(cors());

// Redirect API requests to JSON-Server
app.use('/api', jsonServer.router('db.json')); // Adjust 'db.json' to your JSON-Server database file

// Serve Angular application for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000; // Use the provided environment port or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

