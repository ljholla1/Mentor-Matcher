// start by typing 'node server.js'into shell
// then open browser with "http://localhost:3000"
// ctrl+c to terminate and get new line

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
// app.use(express.static(path.join(__dirname, 'public')));
// Serve static files directly from their current directory
app.use(express.static(__dirname));


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
    const profilesCollection = db.collection("profiles");

    usersCollection.createIndex({ "userID": 1 }, { unique: true })
      .then(() => {
        console.log('Index created for usersCollection');
      })
      .catch((err) => {
        console.error('Error creating index for usersCollection:', err);
      });

      profilesCollection.createIndex({ "userID": 1 }, { unique: true })
      .then(() => {
        console.log('Index created for profilesCollection');
      })
      .catch((err) => {
        console.error('Error creating index for profilesCollection:', err);
      });

      
    // Registration route handler

    app.post('/register', async (req, res) => {
      const { username, password, first_name, last_name, role, linkedin, user_type, workstyle, strengths, weaknesses, personality_traits, questionSelection1, questions1, questionSelection2, questions2, availability, zoom, office, nonoffice, mondayCheckbox, tuesdayCheckbox, wednesdayCheckbox, thursdayCheckbox, fridayCheckbox, weekendsCheckbox } = req.body;
    
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
          await usersCollection.insertOne({ 
            userID, 
            username, 
            password
          });
    
          // Insert profile information into profilesCollection
          await profilesCollection.insertOne({
            userID,
            first_name,
            last_name,
            role,
            linkedin,
            user_type,
            workstyle,
            strengths,
            weaknesses,
            personality_traits,
            questionSelection1,
            questions1,
            questionSelection2,
            questions2,
            availability,
            zoom,
            office,
            nonoffice,
            mondayCheckbox,
            tuesdayCheckbox,
            wednesdayCheckbox,
            thursdayCheckbox,
            fridayCheckbox,
            weekendsCheckbox
          });
          
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
    
      console.log('Received login request:', { username, password });
    
      try {
        if (!username || !password) {
          return res.status(400).send('Missing username or password');
        }
    
        // Query the database to find a user with the provided username
        const user = await usersCollection.findOne({ username });
    
        console.log('User from database:', user);
    
        if (user) {
          // Compare the provided password with the password stored in the database
          if (user.password === password) {
            // Passwords match, redirect to profiles page
            console.log('Login successful for user:', username);
            const userProfile = await profilesCollection.findOne({ userID: user.userID });
            // res.json({ user, userProfile });

            res.redirect('/profiles.html');
          } else {
            // Passwords don't match, show error message
            console.log('Invalid password for user:', username);
            res.status(401).send('Invalid password');
          }
        } else {
          // User not found, show error message
          console.log('User not found:', username);
          res.status(401).send('User not found');
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
      }
    });
    
    // New route handler to fetch all profiles
    app.get('/profiles', async (req, res) => {
      try {
        const allProfiles = await profilesCollection.find().toArray();
        res.json(allProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).send('Internal server error');
      }
    });

    // New route handler to fetch detailed profile information for a specific user
    app.get('/profile/:userID', async (req, res) => {
      const userID = req.params.userID;

      try {
        const userProfile = await profilesCollection.findOne({ userID });

        if (!userProfile) {
          return res.status(404).send('Profile not found');
        }

        res.json(userProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
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


