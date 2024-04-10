// start by typing 'node index.js'into shell
// then open browser with "http://localhost:3000"
// ctrl+c to terminate and get new line

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid'); // Import uuid library
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://connectionuser:M0ng0B0ng01@database.mdfo0su.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Choose the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

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

app.post('/register', upload.single('profilePicture'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  
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
    res.locals.profiles = profiles; // Store profiles in res.locals
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
