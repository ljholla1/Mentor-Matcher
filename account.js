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

// Function to populate form fields with profile data
function populateForm(profileData) {
    document.getElementById('username').value = profileData.username;
    document.getElementById('first_name').value = profileData.first_name;
    document.getElementById('last_name').value = profileData.last_name;
    document.getElementById('role').value = profileData.role;
    document.getElementById('linkedin').value = profileData.linkedin;
    document.getElementById('user_type').value = profileData.user_type;
    document.getElementById('workstyle').value = profileData.workstyle;
    document.getElementById('weaknesses').value = profileData.weaknesses;
    document.getElementById('personality_traits').value = profileData.personality_traits;
    document.getElementById('availability').value = profileData.availability;

    // Check the appropriate checkboxes based on profile data
    document.getElementById('zoom').checked = profileData.zoom;
    document.getElementById('office').checked = profileData.office;
    document.getElementById('nonoffice').checked = profileData.nonoffice;
    document.getElementById('mondayCheckbox').checked = profileData.mondayCheckbox;
    document.getElementById('tuesdayCheckbox').checked = profileData.tuesdayCheckbox;
    document.getElementById('wednesdayCheckbox').checked = profileData.wednesdayCheckbox;
    document.getElementById('thursdayCheckbox').checked = profileData.thursdayCheckbox;
    document.getElementById('fridayCheckbox').checked = profileData.fridayCheckbox;
    document.getElementById('weekendsCheckbox').checked = profileData.weekendsCheckbox;

    // Populate strengths checkboxes based on profile data
    if (profileData.strengths.includes('Python')) {
        document.getElementById('python').checked = true;
    }
    if (profileData.strengths.includes('JavaScript')) {
        document.getElementById('javascript').checked = true;
    }
    // Populate other strengths checkboxes similarly
    if (profileData.strengths.includes('HTML5')) {
        document.getElementById('html5').checked = true;
    }
    if (profileData.strengths.includes('CSS')) {
        document.getElementById('css').checked = true;
    }
    if (profileData.strengths.includes('SQL')) {
        document.getElementById('sql').checked = true;
    }
    if (profileData.strengths.includes('Java')) {
        document.getElementById('java').checked = true;
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

// Fetch user profile data from the server and populate the form
document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('/profile'); // Assuming this endpoint returns the user's profile data
        if (response.ok) {
            const profileData = await response.json();
            populateForm(profileData);
        } else {
            console.error('Failed to fetch profile data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
});
