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

document.addEventListener("DOMContentLoaded", function () {
  // Fetch user profiles from the server
  fetch('/profiles')
    .then(response => response.json())
    .then(profiles => {
      // Generate profile cards based on the retrieved profiles
      const profileContainer = document.getElementById('profile-container');

      profiles.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.classList.add('video');

        // Customize the profile card based on profile data
        profileCard.innerHTML = `
          <div class="thumbnail">
            <img src="${profile.profile_picture}" alt="Profile Picture">
          </div>
          <h2>${profile.first_name} ${profile.last_name}</h2>
          <p>${profile.role}</p>
          <!-- Add more profile information as needed -->
        `;

        // Append the profile card to the container
        profileContainer.appendChild(profileCard);
      });
    })
    .catch(error => {
      console.error('Error fetching profiles:', error);
    });
});

