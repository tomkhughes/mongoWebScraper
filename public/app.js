// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one



  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    const link = data[i].link;
    const title = data[i].title;
    const id =  data[i]._id;
    // WORKING //

    // $(".articleTitle").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>"+"<a href='" + link + "' id='1'>READ FULL ARTICLE</a>");
    // $("p").addClass('card-panel');
    // $('a').addClass('waves-effect waves-light btn blue lighten-1').attr('id', 'btnSignUp');
    $('.ulDiv').append("<ul id='li' class='collapsible' data-collapsible='accordion'><li class='list'><div class='collapsible-header'>" 
      + title + "</div><div class='collapsible-body'><a class='waves-effect waves-light btn blue' href='" + link 
      + "'>READ FULL ARTICLE</a></div></li><li><div class='collapsible-header'><i class='material-icons'>chat_bubble_outline</i>Add a Comment</div><div class='collapsible-body'><form id='form-add-" + id + "' action='add/comment/" + id + "' method='post'><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><i class='material-icons prefix'>account_circle</i><input id='author_name' name='name' type='text' class='validate'><label for='author_name'>Type Your Name:</label></div></div><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><i class='material-icons prefix'>chat_bubble_outline</i><textarea id='comment_box' name='comment' class='materialize-textarea'></textarea><label for='comment_box'>Add Comment:</label></div></div><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><center><input class='btn addComment' data-id='" + id + "' type='submit' value='Submit'></center></div></div></form></div></li></ul>");

    // $("").append("<div class='collapsible-body'><form id='form-add-{{_id}}' action='add/comment/{{_id}}' method='post'><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><i class='material-icons prefix'>account_circle</i><input id='author_name' name='name' type='text' class='validate'><label for='author_name'>Type Your Name:</label></div></div><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><i class='material-icons prefix'>chat_bubble_outline</i><textarea id='comment_box' name='comment' class='materialize-textarea'></textarea><label for='comment_box'>Add Comment:</label></div></div><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><center><input class='btn addComment' data-id='{{_id}}' type='submit' value='Submit'></center></div></div></form></div>");
    // $("").append("");

  }
});
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});