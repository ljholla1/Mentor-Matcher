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
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017'; // Update this with Sarah's MongoDB URI

// Database Name
const dbName = 'mentor_matching'; // Update this with database name

// Collection Name
const collectionName = 'user_profiles'; // Update this with collection name

// Function to save user profile data to MongoDB
async function saveUserProfile(profileData) {
    // Connect to MongoDB
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();

        // Connect to the database
        const db = client.db(dbName);

        // Get the collection
        const collection = db.collection(collectionName);

        // Insert the profile data into the collection
        const result = await collection.insertOne(profileData);
        console.log(`Profile data saved with ID: ${result.insertedId}`);
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
