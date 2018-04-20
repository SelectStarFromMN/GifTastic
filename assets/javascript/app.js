
var animalArray = [];

// Let's use localStorage so user doesn't need to reenter favorite animals
window.onload = function () {
    storedAnimalArray = JSON.parse(localStorage.getItem("Animals"));
    if (storedAnimalArray.length > 0) {
        animalArray = storedAnimalArray;
    } else {
        animalArray = ["cat", "dog", "bird"];
    }
    displayAnimalList();
};




// Click event listener for animal buttons
$(document.body).on("click", "button", function () {
    // Grab and store the data-animal property value from the button
    var animal = $(this).attr("data-animal");

    // Construct a queryURL using the animal name
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        animal + "&api_key=EMBfpXpNjy7nMgYzLshSd8Ng1MGvXEGx&limit=10";

    // Perform an AJAX request with the queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // After data comes back from the request
        .then(function (response) {
            // store the data from the AJAX request in the results variable
            var results = response.data; // Array of objects

            // Add hint
            $("#click-hint").text("Click any GIFs below to start/stop animation.")

            // Loop through each result item
            for (var i = 0; i < results.length; i++) {

                // Create and store a div tag
                var animalDiv = $("<div>");

                // Create a paragraph tag with the result item's rating
                // var p = $("<p>").text(`Rating: ${results[i].rating.toUpperCase()}`);

                // Create and store an image tag
                var animalImage = $("<img>");
                // Set the src attribute to the fixed-still image url (initially still)
                animalImage.attr("src", results[i].images.fixed_height_still.url);
                // Set the data-still attribute to the fixed-still image (same as above, stashed for toggling between)
                animalImage.attr("data-still", results[i].images.fixed_height_still.url);
                // Set the data-animate attribute to the fixed-height (non-still) image url
                animalImage.attr("data-animate", results[i].images.fixed_height.url);
                // Set the initial data-state attribute to still (we've started with the fixed-still url above)
                animalImage.attr("data-state", "still");
                // Set the class attribute to gif-button (so we can target it with jquery click event)
                animalImage.attr("class", "gif-button");

                // Append the paragraph and image tag to the animalDiv
                // animalDiv.append(p);
                animalDiv.append(animalImage);

                // Prepend the animalDiv to the HTML page in the "#gifs-appear-here" div
                $("#gifs-appear-here").prepend(animalDiv);
            }
        }); // .then()
}); // button onClick


//  On Click event associated with the add-animal form
$("#add-animal-submit").on("click", function (event) {
    event.preventDefault();

    var newAnimal = $('#new-animal-input').val().trim().toLowerCase();

    if (!animalArray.includes(newAnimal)) {
        animalArray.push(newAnimal);
    }

    // Add new Animal to localStorage
    localStorage.clear();
    localStorage.setItem("Animals", JSON.stringify(animalArray));

    // Clear text & set focus
    $("#new-animal-input").val('').focus();

    displayAnimalList();

});

// For each animal in the array/list, create a button along the top of the screen for fetching gifs
function displayAnimalList() {
    $('#animal-buttons-go-here').html('');
    for (var i = 0; i < animalArray.length; i++) {
        $('#animal-buttons-go-here').append(
            `<button data-animal="${animalArray[i]}">${animalArray[i]}</button>`
        );
    }
    $('#animal-buttons-go-here').append('<br>');
}

// When we click on a (dynamically added) gif-button, toggle from still/animate
$(document.body).on("click", ".gif-button", function () {

    var $img = $(this);                   // Handle on this img element (note jquery $ convention)
    var state = $img.attr('data-state');  // Grab the current state so we can refer to it

    // If current state is 'still' toggle src to the data-animate url and state to 'animate'
    // else (current state is 'animate') toggle src to the data-still url and state to 'still'
    if (state == "still") {
        var animated_gif_url = $img.attr('data-animate');
        $img.attr({ 'src': animated_gif_url, 'data-state': 'animate' });
    } else {
        var still_gif_url = $img.attr('data-still');
        $img.attr({ 'src': still_gif_url, 'data-state': 'still' });
    }

});