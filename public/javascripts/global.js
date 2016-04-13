// Userlist data array for filling in info box
var foodListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#foodList table tbody').on('click', 'td a.linkshowfood', showFoodInfo);

    // Add User button click
    $('#btnAddFood').on('click', addFood);

    // Delete User link click
    $('#foodList table tbody').on('click', 'td a.linkdeletefood', deleteFood);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';
    var total = parseInt(0);

    // jQuery AJAX call for JSON
    $.getJSON( '/api/food', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        foodListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowfood" rel="' + this.name + '" title="Show Details">' + this.name + '</a></td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '<td><a href="#" class="linkdeletefood" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';

            total += parseInt(this.price);
        });

        // Inject the whole content string into our existing HTML table
        $('#foodList table tbody').html(tableContent);
        $('#foodTotalPrice').text(total*0.075+total);
    });
};

// Show User Info
function showFoodInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisFoodName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = foodListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisFoodName);

    // Get our User Object
    var thisFoodObject = foodListData[arrayPosition];

    //Populate Info Box
    $('#foodInfoName').text(thisFoodObject.name);
    $('#foodInfoPrice').text(thisFoodObject.price);

};

// Add User
function addFood(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addFood input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newFood = {
            'name': $('#addFood fieldset input#inputFoodName').val(),
            'price': $('#addFood fieldset input#inputFoodPrice').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newFood,
            url: '/api/food',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#newFood fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteFood(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this food?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/api/food/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
