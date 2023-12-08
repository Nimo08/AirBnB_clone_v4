// Script must be executed only when DOM is loaded
// Listen for changes on each input checkbox tag:
// If the checkbox is checked, you must store the Amenity ID
// in a variable (dictionary or list)
// If the checkbox is unchecked, you must remove the Amenity ID
// from the variable
// Update the h4 tag inside the div Amenities with the list
// of Amenities checked

$(document).ready(function () {
  const isChecked = {};
  const showReviewsButton = $('#show-reviews');

  // listen for changes on checkboxes
  $('input[type="checkbox"]').change(function () {
    const itemID = $(this).data('id');
    const itemName = $(this).data('name');
    const itemType = $(this).data('type');

    if (!isChecked[itemType]) {
      isChecked[itemType] = {};
    }

    if ($(this).is(':checked')) {
      isChecked[itemType][itemID] = itemName;
    } else {
      delete isChecked[itemType][itemID];
    }

    updateItems();
  });

  function updateItems () {
    const listAmenities = Object.values(isChecked.amenities || {}).join(', ');
    const listCities = Object.values(isChecked.cities || {}).join(', ');
    const listStates = Object.values(isChecked.states || {}).join(', ');

    $('.amenities h4').text('Amenities: ' + listAmenities);
    $('.locations h4').text('Locations: ' + listCities + ', ' + listStates);
  }

  $('#filter-btn').click(function () {
    // Make a POST request to places_search with the list of checked amenities, cities, and states
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(isChecked.amenities || {}),
        cities: Object.keys(isChecked.cities || {}),
        states: Object.keys(isChecked.states || {})
      }),
      dataType: 'json',
      success: function (data) {
        $('.places').empty(); // Clear existing places

        // Loop through the result and create article tags
        data.forEach(function (place) {
          const article = `<article>
                              <div class="title_box">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">$${place.price_by_night}</div>
                              </div>
                              <div class="information">
                                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                              </div>
                              <div class="description">
                                ${place.description}
                              </div>
                            </article>`;
          $('.places').append(article);
        });
      },
      error: function (error) {
        console.error('Error fetching places:', error);
      }
    });
  });

  // Request API status
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    },
    error: function (error) {
      console.error('Error fetching API status:', error);
    }
  });

  // Show/hide reviews functionality
  showReviewsButton.click(function () {
    const reviewsContainer = $('.reviews-container');

    if (showReviewsButton.text() === 'show') {
      // Fetch and display reviews
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/reviews/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          reviewsContainer.empty(); // Clear existing reviews

          // Loop through the result and create review elements
          data.forEach(function (review) {
            const reviewElement = `<div class="review">
                                      <h3>${review.place_name}</h3>
                                      <p>${review.text}</p>
                                    </div>`;
            reviewsContainer.append(reviewElement);
          });
        },
        error: function (error) {
          console.error('Error fetching reviews:', error);
        }
      });

      showReviewsButton.text('hide');
    } else {
      // Hide reviews by removing all review elements
      reviewsContainer.empty();
      showReviewsButton.text('show');
    }
  });
});
