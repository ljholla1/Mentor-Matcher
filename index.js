// start by typing 'node server.js'into shell

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid'); // Import uuid library
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://connectionuser:M0ng0B0ng01@database.mdfo0su.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Define route handlers
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the Express server
client.connect()
  .then(() => {
    const db = client.db('name_generator');
    const usersCollection = db.collection("users");
    const availableNamesCollection = db.collection('availableNames');

    usersCollection.createIndex({ "userID": 1 }, { unique: true })
      .then(() => {
        console.log('Index created for usersCollection');
      })
      .catch((err) => {
        console.error('Error creating index for usersCollection:', err);
      });

    availableNamesCollection.createIndex({ "nameID": 1 }, { unique: true })
      .then(() => {
        console.log('Index created for availableNamesCollection');
      })
      .catch((err) => {
        console.error('Error creating index for availableNamesCollection:', err);
      });

    // Registration route handler
    app.post('/register', async (req, res) => {
      const { username, password } = req.body;

      try {
        // Check if the username already exists in the database
        const existingUser = await usersCollection.findOne({ username: username });
        if (existingUser) {
          return res.status(400).send('Username already exists. Please choose a different username.');
        }
        // Generate unique userID
        let userID = uuidv4();

        // Check if userID is unique (just in case)
        let userWithSameIDExists = await usersCollection.findOne({ userID });
        while (userWithSameIDExists) {
          // If userID already exists, generate a new one
          userID = uuidv4();
          userWithSameIDExists = await usersCollection.findOne({ userID });
        }

        // Insert user into the database with the unique userID
        try {
          await usersCollection.insertOne({ userID, username, password });
          console.log('User registered successfully');
          res.sendStatus(200); // Send success response
        } catch (error) {
          console.error('Error registering user:', error);
          res.status(500).send('Failed to register user'); // Send error response
        }
      } catch (error) {
        console.error('Error:', error); // Log any unexpected errors
        res.status(500).send('Internal server error');
      }
    });

    // Login route handler

    app.post('/login', async (req, res) => {
      const { username, password } = req.body;

      try {
        if (!username || !password) {
          return res.status(400).send('Missing username or password');
        }

        console.log('Received username:', username); // Log the username received in the request

        // Query the database to find a user with the provided username
        const user = await usersCollection.findOne({ username });

        console.log('User from database:', user); // Log the user found in the database

        if (user) {
          // Compare the provided password with the password stored in the database
          if (user.password === password) {
            // Passwords match, redirect to generator page
            res.redirect('/generator.html');
          } else {
            // Passwords don't match, show error message
            res.status(401).send('Invalid password');
          }
        } else {
          // User not found, show error message
          res.status(401).send('User not found');
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
      }
    });



    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
