// js for server:
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '')));

const uri = 'mongodb+srv://stle4:Bunbohue05%21@database.mdfo0su.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function insertDocument(collectionName, document) {
    const database = client.db('usersDB');
    const collection = database.collection('users');
    try {
        const result = await collection.insertOne(document);
        console.log(`Inserted document with ID ${result.insertedId}`);
    } catch (error) {
        console.error('Error inserting document:', error);
    }
}

async function closeConnection() {
    try {
        await client.close();
        console.log('Connection to MongoDB closed');
    } catch (error) {
        console.error('Error closing connection:', error);
    }
}

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const database = client.db('usersDB');
    const collection = database.collection('users');
    try {
        const result = await collection.insertOne({ username, password });
        console.log('User registered successfully');
        res.sendStatus(200);
    } catch (error) {
        console.error('Error registering user:', error);
        res.sendStatus(500);
    }
});

// Start the server
function startServer() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { connectToDatabase, insertDocument, closeConnection, startServer };


// js for search queries:

// Get the search input and filter checkboxes
const searchInput = document.getElementById('searchInput');
const checkboxes = document.querySelectorAll('.filterCheckboxes input[type="checkbox"]');

// Add event listeners for search input and checkboxes
searchInput.addEventListener('input', filterProducts);
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filterProducts);
});

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedTags = [...checkboxes].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

  const products = document.querySelectorAll('.video');
  products.forEach(product => {
    const productName = product.querySelector('h2').innerText.toLowerCase();
    const productTags = product.dataset.tags.split(',').map(tag => tag.trim());

    // Check if product name matches search term or has selected tags
    const matchesSearch = productName.includes(searchTerm);
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => productTags.includes(tag));

    // Show or hide product based on filter criteria
    if (matchesSearch && matchesTags) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

