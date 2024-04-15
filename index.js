// start by typing 'node index.js'into shell
// then open browser with "http://localhost:3000"
// ctrl+c to terminate and get new line

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid'); // Import uuid library
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://connectionuser:M0ng0B0ng01@database.mdfo0su.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Define route handlers
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let usersCollection;
let profilesCollection;

// Start the Express server
client.connect()
  .then(() => {
    const db = client.db('name_generator');
    usersCollection = db.collection("users");
    profilesCollection = db.collection("profiles");

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
    // app.post('/register', upload.single('profilePicture'), async (req, res) => {
    //   if (!req.file) {
    //     return res.status(400).send('No file uploaded');
    //   }
      
    //   const { username, password, first_name, last_name, role, linkedin, user_type, workstyle, strengths, weaknesses, personality_traits, questionSelection1, questions1, questionSelection2, questions2, availability, zoom, office, nonoffice, mondayCheckbox, tuesdayCheckbox, wednesdayCheckbox, thursdayCheckbox, fridayCheckbox, weekendsCheckbox } = req.body;

    //   try {
    //     const existingUser = await usersCollection.findOne({ username: username });
    //     if (existingUser) {
    //       return res.status(400).send('Username already exists. Please choose a different username.');
    //     }
    
    //     let userID = uuidv4();
    //     let userWithSameIDExists = await usersCollection.findOne({ userID });
    //     while (userWithSameIDExists) {
    //       userID = uuidv4();
    //       userWithSameIDExists = await usersCollection.findOne({ userID });
    //     }
    
    //     try {
    //       await usersCollection.insertOne({ 
    //         userID, 
    //         username, 
    //         password
    //       });
    
    //       await profilesCollection.insertOne({
    //         userID,
    //         first_name,
    //         last_name,
    //         role,
    //         linkedin,
    //         user_type,
    //         workstyle,
    //         strengths,
    //         weaknesses,
    //         personality_traits,
    //         questionSelection1,
    //         questions1,
    //         questionSelection2,
    //         questions2,
    //         availability,
    //         zoom,
    //         office,
    //         nonoffice,
    //         mondayCheckbox,
    //         tuesdayCheckbox,
    //         wednesdayCheckbox,
    //         thursdayCheckbox,
    //         fridayCheckbox,
    //         weekendsCheckbox,
    //         profilePicture: req.file.filename
    //       });
          
    //       console.log('User registered successfully');
    //       res.sendStatus(200);
    //     } catch (error) {
    //       console.error('Error registering user:', error);
    //       res.status(500).send('Failed to register user');
    //     }
    //   } catch (error) {
    //     console.error('Error:', error);
    //     res.status(500).send('Internal server error');
    //   }
    // });


    // const express = require('express');
    // const session = require('express-session');
    
    // const app = express();
    
    // // Configure session middleware
    // app.use(session({
    //   secret: 'your_secret_key_here', // Replace with a strong, random secret key
    //   resave: false,
    //   saveUninitialized: true,
    //   cookie: { secure: false } // Set to true for https connections only
    // }));
    
    // ... rest of your code (routes, middleware, etc.)
    
    // app.listen(PORT, () => {
    //   console.log(`Server listening on port ${PORT}`);
    // });
    

app.post('/register', async (req, res) => {
  
  const { username, password, first_name, last_name, role, linkedin, user_type, workstyle, strengths, weaknesses, personality_traits, questionSelection1, questions1, questionSelection2, questions2, availability, zoom, office, nonoffice, mondayCheckbox, tuesdayCheckbox, wednesdayCheckbox, thursdayCheckbox, fridayCheckbox, weekendsCheckbox } = req.body;

  try {
    const existingUser = await usersCollection.findOne({ username: username });
    if (existingUser) {
      return res.status(400).send('Username already exists. Please choose a different username.');
    }

    let userID = uuidv4();
    let userWithSameIDExists = await usersCollection.findOne({ userID });
    while (userWithSameIDExists) {
      userID = uuidv4();
      userWithSameIDExists = await usersCollection.findOne({ userID });
    }

    try {
      await usersCollection.insertOne({ 
        userID, 
        username, 
        password
      });

      await profilesCollection.insertOne({
        userID,
        first_name,
        last_name,
        user_type,     
        linkedin,
        role,
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
        weekendsCheckbox,
      });
      
      console.log('User registered successfully');
      res.sendStatus(200);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Failed to register user');
    }
  } catch (error) {
    console.error('Error:', error);
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
    
        const user = await usersCollection.findOne({ username });
    
        console.log('User from database:', user);
    
        if (user) {
          if (user.password === password) {
            console.log('Login successful for user:', username);
            global.loggedInUserID = user.userID;
            const userProfile = await profilesCollection.findOne({ userID: user.userID });
        
            res.redirect('/profiles.html');
          } else {
            console.log('Invalid password for user:', username);
            res.status(401).send('Invalid password');
          }
        } else {
          console.log('User not found:', username);
          res.status(401).send('User not found');
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
      }
    });
    
    app.post('/update-profile', async (req, res) => {
      const { userID, ...profileData } = req.body;
  
      try {
          // Check for existing profile with the userID
          const existingProfile = await profilesCollection.findOne({ userID });
  
          if (existingProfile) {
              // Update profile data in the profiles collection if document exists
              const result = await profilesCollection.updateOne({ userID }, { $set: profileData });
              alert('Changes saved successfully!');
  
              if (result.modifiedCount === 1) {
                  console.log('Profile data updated successfully');
                  res.sendStatus(200);
                  alert('Changes saved successfully!');
              } else {
                  console.error('No changes detected during update');
                  res.sendStatus(200); // Or another appropriate status code (e.g., 304 Not Modified)
              }
          } else {
              console.error('Profile with userID not found');
              res.status(404).send('Profile not found');
          }
      } catch (error) {
          console.error('Error updating profile data:', error);
          res.status(500).send('Internal Server Error');
      }
  });
    
    // Define the route handler to fetch a detailed profile information for a specific user
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

    // Route handler to fetch detailed profile information for the logged-in user
    app.get('/profile', async (req, res) => {
      const loggedInUserID = req.user.userID;

      try {
        const userProfile = await profilesCollection.findOne({ userID: loggedInUserID });

        if (!userProfile) {
          return res.status(404).send('Profile not found');
        }

        res.json(userProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Internal server error');
      }
    });

    app.post('/send-request', async (req, res) => {
      const { recipientUserID } = req.body;
      console.log('recipientUserID received:', recipientUserID);
    
      try {
        // Get the logged-in user's userID from the session or global variable
        const loggedInUserID = global.loggedInUserID;
    
        // Store the friend request data in a suitable data structure or database collection
        const requestData = {
          senderUserID: loggedInUserID,
          recipientUserID,
          timestamp: new Date(),
          // Add any additional data you need to store for the request
        };
    
        // Example: Store the request data in a new collection called 'friendRequests'
        const friendRequestsCollection = db.collection('requests');
        await friendRequestsCollection.insertOne(requestData);
    
        res.sendStatus(200);
      } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).send('Internal Server Error');
      }
    });


    app.get('/get-friend-requests', async (req, res) => {
      try {
        // Get the logged-in user's userID from the session or global variable
        const loggedInUserID = global.loggedInUserID;
    
        // Query the database for friend requests received by the logged-in user
        const friendRequestsCollection = db.collection('requests');
        const friendRequests = await friendRequestsCollection
          .find({ recipientUserID: loggedInUserID })
          .toArray();
    
        // Fetch the sender's profile data for each request
        const requestsWithSenderProfiles = await Promise.all(
          friendRequests.map(async (request) => {
            const senderProfile = await profilesCollection.findOne({
              userID: request.senderUserID,
            });
            return { ...request, senderUsername: senderProfile.first_name + ' ' + senderProfile.last_name };
          })
        );
    
        res.json(requestsWithSenderProfiles);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Route handler to fetch all profiles
    // app.get('/profiles', async (req, res) => {
    //   try {
    //     const profiles = await profilesCollection.find({}).toArray();
    //     res.json(profiles);
    //   } catch (error) {
    //     console.error('Error fetching profiles:', error);
    //     res.status(500).send('Internal Server Error');
    //   }
    // });


    // Route handler to fetch all profiles and store them in an array
app.get('/profiles', async (req, res) => {
  try {
    const profiles = await profilesCollection.find({}).toArray();
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).send('Internal Server Error');
  }
});


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
