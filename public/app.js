// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        const link = data[i].link;
        const title = data[i].title;
        const id = data[i]._id;
        // WORKING //

        // $(".articleTitle").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>"+"<a href='" + link + "' id='1'>READ FULL ARTICLE</a>");
        // $("p").addClass('card-panel');
        // $('a').addClass('waves-effect waves-light btn blue lighten-1').attr('id', 'btnSignUp');
        $('.ulDiv').append("<ul id='li' class='collapsible' data-collapsible='accordion'><li class='list'><div class='collapsible-header'>" +
            title + "</div><div class='collapsible-body'><a class='waves-effect waves-light btn blue' href='" + link +
            "'>READ FULL ARTICLE</a></div></li><li><div class='collapsible-header'><i class='material-icons'>chat_bubble_outline</i>Add a Comment</div><div class='collapsible-body'><form class='submitForm' id=" + id + "><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><i class='material-icons prefix'>account_circle</i><input id='author_name-" + id + "' name='name' type='text' class='validate'><label for='author_name'>Type Your Name:</label></div></div><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><i class='material-icons prefix'>chat_bubble_outline</i><textarea id='comment_box-" + id + "' name='comment' class='materialize-textarea'></textarea><label for='comment_box'>Add Comment:</label></div></div><div class='row'><div class='input-field col s2'></div><div class='input-field col s8'><center><input class='btn addComment submit' data-id='" + id + "' type='button' value='Submit'></center></div></div></form></div></li></ul><div class='comments-" + id + "'></div>");
        $('.submitForm').submit(function() {
            sendContactForm();
            return false;
        });

    }
});
$(document).ready(function() {
    $('.collapsible').collapsible();
});
$(".submitForm").submit(function(e) {
    e.preventDefault();
});
// When you click the savenote button
$(document).on("click", ".addComment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
     var baseURL = window.location.origin;
    $.ajax({
            method: "POST",
            url: baseURL + "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#author_name-" + thisId + "").val(),
                // Value taken from note textarea
                body: $("#comment_box-" + thisId + "").val()
            }
        })
        // With that done
        .then(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            let author = $("#author_name-" + thisId + "").val().trim();
            let commentText = $("#comment_box-" + thisId + "").val();
            $(".comments-" + thisId + "").append("<ul id='li' class='collapsible' data-collapsible='accordion'><li class='list'><div class='collapsible-header'><i class='material-icons'>chat_bubble_outline</i><br>Author: " + author + "<br> Comment: " + commentText + "</div><div class='collapsible-body'><span>Hello world</span></div>");
            $(".comments-" + thisId + "").append("<a id='delete' class='deleteComment waves-effect waves-light btn red'>DELETE COMMENT</a>")
            // Also, remove the values entered in the input and textarea for note entry
            $("#titleinput").val("");
            $("#bodyinput").val("");
        });
});

$(document).on("click", ".deleteComment", function() {
    console.log('click delete');

    // Get id of comment to be deleted
    var thisId = $(this).attr("data-id");
    // URL root (so it works in either LocalHost or Heroku)
    var baseURL = window.location.origin;

    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/articles/' + thisId,
      type: 'POST',
    })
    .done(function() {
      // Refresh Window after the call is done
      location.reload();
    });
    
    // Prevent Default
    return false;
});
  