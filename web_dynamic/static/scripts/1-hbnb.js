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

  // listen for changes
  $('input[type="checkbox"]').change(function () {
    const amenityID = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      isChecked[amenityID] = amenityName;
    } else {
      delete isChecked[amenityID];
    }
    updateAmenities();
  });

  function updateAmenities () {
    // object.values: extract array of all value
    const listAmenities = Object.values(isChecked).join(', ');
    $('.amenities h4').text('Amenities: ' + listAmenities);
  }
});
