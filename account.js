// // Get the edit button and all the spans that display data
// const editButton = document.getElementById('editButton');
// const spans = document.querySelectorAll('.info span');

// // Function to toggle edit mode
// function toggleEditMode() {
//   spans.forEach(span => {
//     const input = document.createElement('input');
//     input.value = span.textContent;
//     span.textContent = '';
//     span.appendChild(input);
//   });
// }

// // Add click event listener to the edit button
// editButton.addEventListener('click', toggleEditMode);
// Import the MongoDB Node.js driver

// LIAM DRAFT
// const { MongoClient } = require('mongodb');
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// // MongoDB connection URI
// const uri = "mongodb+srv://connectionuser:M0ng0B0ng01@database.mdfo0su.mongodb.net/?retryWrites=true&w=majority";

// // Database Name
//  const dbName = client.db('name_generator'); // Update this with database name
// // const db = client.db('name_generator');


// // Collection Name
// const collectionName = 'user_profiles'; // Update this with collection name
// const usersCollection = db.collection("users");
// const profilesCollection = db.collection("profiles");

// // Function to save user profile data to MongoDB
// async function saveUserProfile(profileData) {
//     // Connect to MongoDB
//     const client = new MongoClient(uri);

//     try {
//         // Connect to the MongoDB server
//         await client.connect();

//         // Connect to the database
//         const db = client.db(dbName);

//         // Get the collection
//         const collection = db.collection(collectionName);

//         // Insert the profile data into the collection
//         const result = await collection.insertOne(profileData);
//         console.log(`Profile data saved with ID: ${result.insertedId}`);
//     } catch (error) {
//         console.error('Error saving profile data:', error);
//     } finally {
//         // Close the connection
//         await client.close();
//     }
// }

// // Event listener for form submission
// document.getElementById('profile-form').addEventListener('submit', async function(event) {
//     event.preventDefault(); // Prevent default form submission

//     // Extract form data
//     const formData = new FormData(this);

//     // Convert form data to JSON
//     const profileData = {};
//     formData.forEach((value, key) => {
//         profileData[key] = value;
//     });

//     // Save user profile data to MongoDB
//     await saveUserProfile(profileData);

//     // Show success message
//     alert('Changes saved successfully!');
// });



const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://connectionuser:M0ng0B0ng01@database.mdfo0su.mongodb.net/?retryWrites=true&w=majority";

// Database Name
const dbName = 'name_generator'; // Update this with database name

// Collection Names
const profilesCollectionName = 'profiles'; // Update this with the profiles collection name
const usersCollectionName = 'users'; // Update this with the users collection name

// Function to save user profile data to MongoDB
async function saveUserProfile(profileData) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB server
        await client.connect();

        // Connect to the database
        const db = client.db(dbName);

        // Get the profiles collection
        const profilesCollection = db.collection(profilesCollectionName);

        // Insert the profile data into the profiles collection
        const result = await profilesCollection.insertOne(profileData);
        console.log(`Profile data saved with ID: ${result.insertedId}`);

        // Get the users collection
        const usersCollection = db.collection(usersCollectionName);

        // Insert the profile data into the users collection
        const userResult = await usersCollection.insertOne(profileData);
        console.log(`User data saved with ID: ${userResult.insertedId}`);
    } catch (error) {
        console.error('Error saving profile data:', error);
    } finally {
        // Close the connection
        await client.close();
    }
}



// Event listener for form submission
document.getElementById('profile-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Extract form data
    const formData = new FormData(this);

    // Convert form data to JSON
    const profileData = {};
    formData.forEach((value, key) => {
        profileData[key] = value;
    });

    // Save user profile data to MongoDB
    await saveUserProfile(profileData);

    // Show success message
    alert('Changes saved successfully!');
});


document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
      registerForm.addEventListener("submit", handleRegisterFormSubmission);
    }

    function handleRegisterFormSubmission(event) {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const credentials = {
    username: formData.get("username"),
    password: formData.get("password"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    role: formData.get("role"),
    linkedin: formData.get("linkedin"),
    user_type: formData.get("user_type"),
    workstyle: formData.get("workstyle"),
    strengths: [], // Initialize strengths array
    weaknesses: formData.get("weaknesses"),
    personality_traits: [], // Initialize personality_traits array
    questionSelection1: formData.get("questionSelection1"),
    questions1: formData.get("questions1"),
    questionSelection2: formData.get("questionSelection2"),
    questions2: formData.get("questions2"),
    availability: formData.get("availability"),
    zoom: formData.has("zoom"), // Check if checkbox is checked
    office: formData.has("office"), // Check if checkbox is checked
    nonoffice: formData.has("nonoffice"), // Check if checkbox is checked
    mondayCheckbox: formData.has("mondayCheckbox"), // Check if checkbox is checked
    tuesdayCheckbox: formData.has("tuesdayCheckbox"), // Check if checkbox is checked
    wednesdayCheckbox: formData.has("wednesdayCheckbox"), // Check if checkbox is checked
    thursdayCheckbox: formData.has("thursdayCheckbox"), // Check if checkbox is checked
    fridayCheckbox: formData.has("fridayCheckbox"), // Check if checkbox is checked
    weekendsCheckbox: formData.has("weekendsCheckbox") // Check if checkbox is checked
  };

  // Populate strengths array with checked checkboxes
  if (formData.has("python")) credentials.strengths.push("Python");
  if (formData.has("javascript")) credentials.strengths.push("JavaScript");
  if (formData.has("html5")) credentials.strengths.push("HTML5");
  if (formData.has("css")) credentials.strengths.push("CSS");
  if (formData.has("sql")) credentials.strengths.push("SQL");
  if (formData.has("java")) credentials.strengths.push("Java");

  // Populate personality_traits array with checked checkboxes
  if (formData.has("friendlyCheckbox")) credentials.personality_traits.push("friendly");
  if (formData.has("formalCheckbox")) credentials.personality_traits.push("formal");
  if (formData.has("honestCheckbox")) credentials.personality_traits.push("honest");

  registerUser(credentials);
}


    async function registerUser(credentials) {
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        if (response.ok) {
          alert("Changes updated!");
          window.location.href = "index.html";
        } else {
          const errorMessage = await response.text();
          alert(errorMessage || "Failed to register. Please try again.");
        }
      } catch (error) {
        console.error('Error:', error);
        alert("Failed to register. Please try again.");
      }
    }
  });