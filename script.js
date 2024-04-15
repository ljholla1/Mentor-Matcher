//original JS from file, do not delete!!!
 // js for search queries:

// // Get the search input and filter checkboxes
// const searchInput = document.getElementById('searchInput');
// const checkboxes = document.querySelectorAll('.filterCheckboxes input[type="checkbox"]');

// // Add event listeners for search input and checkboxes
// searchInput.addEventListener('input', filterProducts);
// checkboxes.forEach(checkbox => {
//   checkbox.addEventListener('change', filterProducts);
// });

// function filterProducts() {
//   const searchTerm = searchInput.value.toLowerCase();
//   const selectedTags = [...checkboxes].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

//   const products = document.querySelectorAll('.video');
//   products.forEach(product => {
//     const productName = product.querySelector('h2').innerText.toLowerCase();
//     const productTags = product.dataset.tags.split(',').map(tag => tag.trim());

//     // Check if product name matches search term or has selected tags
//     const matchesSearch = productName.includes(searchTerm);
//     const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => productTags.includes(tag));

//     // Show or hide product based on filter criteria
//     if (matchesSearch && matchesTags) {
//       product.style.display = 'block';
//     } else {
//       product.style.display = 'none';
//     }
//   });
// }

// ----------------------------------------------------------------------------------------------------------








// Get the search input and filter checkboxes


const searchInput = document.getElementById('searchInput');
const checkboxes = document.querySelectorAll('.filterCheckboxes input[type="checkbox"]');

// Add event listeners for search input and checkboxes
searchInput.addEventListener('input', filterProducts);
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filterProducts);
});

// function filterProducts() {
//   const searchTerm = searchInput.value.toLowerCase().trim();
//   const selectedTags = [...checkboxes].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

//   // Get profiles array stored in res.locals
//   const profiles = res.locals.profiles || [];

//   profiles.forEach(profile => {
//     // Get profile information
//     const { first_name, last_name, role, strengths, weaknesses, user_type } = profile;

//     // Check if profile matches search term and selected tags
//     const matchesSearch = !searchTerm || (first_name.toLowerCase().includes(searchTerm) || last_name.toLowerCase().includes(searchTerm));
//     const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => strengths.includes(tag) || weaknesses.includes(tag));

//     const matchesUserType = selectedUserTypes.length === 0 || selectedUserTypes.includes(user_type);


//     // Display profile information if it matches search term and selected tags
//     if (matchesSearch && matchesTags) {
//       console.log(`Profile: ${first_name} ${last_name}, Role: ${role}, Strengths: ${strengths.join(', ')}, Weaknesses: ${weaknesses.join(', ')}, User Type: ${user_type}`);
//     }
//   });
// }



function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedTags = [...checkboxes].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

  const products = document.querySelectorAll('.video');
  products.forEach(product => {
    const titleElement = product.querySelector('.videoTitle');
    const mentorMenteeElement = product.querySelector('.mentor-mentee'); // Select the element containing mentor/mentee status
    const tagsElements = product.querySelectorAll('.tags .tag'); // Update this line to target the tags within the .tags container

    if (titleElement && tagsElements.length > 0) {
      const productName = titleElement.innerText.toLowerCase().trim();
      const mentorMentee = mentorMenteeElement.innerText.toLowerCase().trim();
      const productTags = Array.from(tagsElements).map(tag => tag.innerText.toLowerCase().trim());

      console.log('Selected tags:', selectedTags);
      console.log('Product tags:', productTags);

      // Check if product name matches search term
      const matchesSearch = !searchTerm || productName.includes(searchTerm);

      // Check if at least one selected tag matches any of the product tags
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => productTags.includes(tag));

      // Check if mentor/mentee status matches any selected filter
      const matchesMentorMentee = selectedTags.includes(mentorMentee);

      console.log(`Product: ${productName}, Matches Search: ${matchesSearch}, Matches Tags: ${matchesTags}`);

      // Show or hide product based on filter criteria
      if (matchesSearch && (matchesTags || matchesMentorMentee)) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    } else {
      console.error('Title or tags not found in product:', product);
    }
  });
}

// function filterProducts() {
//   const searchTerm = searchInput.value.toLowerCase().trim();
//   const selectedTags = [...checkboxes].filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

//   const profiles = res.locals.profiles || [];

//   profiles.forEach(profile => {
//     const { first_name, last_name, role, strengths, weaknesses, user_type } = profile;

//     const matchesSearch = !searchTerm || (first_name.toLowerCase().includes(searchTerm) || last_name.toLowerCase().includes(searchTerm));
//     const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => strengths.includes(tag) || weaknesses.includes(tag));

//     // Check if user type matches selected user type
//     const matchesUserType = selectedUserTypes.length === 0 || selectedUserTypes.includes(user_type);

//     if (matchesSearch && matchesTags && matchesUserType) {
//       console.log(`Profile: ${first_name} ${last_name}, Role: ${role}, Strengths: ${strengths.join(', ')}, Weaknesses: ${weaknesses.join(', ')}, User Type: ${user_type}`);
//     }
//   });
// }