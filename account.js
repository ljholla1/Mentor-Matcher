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
