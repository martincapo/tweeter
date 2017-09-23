/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function renderTweets(tweets) {
  tweets.reverse();
  tweets.forEach((element) => {
    $('#tweets-container').append(createTweetElement(element));
  });
}

function createTweetElement(tweetData) {

  var $tweet        = $('<article class="tweet">');

  var time          = moment(tweetData.created_at).fromNow();
  // Display user info (avatar, name, handle)
  var $header       = $('<header>');
  // Display tweet content (text)
  var $section      = $('<section>');
  // Display created time and buttons (ex. like button)
  var $footer       = $('<footer>');

  var $buttons      = `<i class="fa fa-flag-o" aria-hidden="true"></i>
                       <i class="fa fa-retweet" aria-hidden="true"></i>`;

  var $like_button  = $(`<a href="#" class="like_button" data-likes="${tweetData.likes}" data-id="${tweetData.id}">
                        <i class="fa fa-heart-o likes" aria-hidden="true"></i>
                       </a>`);

  var $footer_buttons = $(`<div class="edit-icon"></div>`)
    .append($buttons)
    .append($like_button)
    .append(`<span class="num-likes">${tweetData.likes}</span>`);


  $header.append($('<img>').addClass('icon').attr('src', tweetData.user.avatars.small));
  $header.append($('<h4>').text(tweetData.user.name));
  $header.append($('<p>').text(tweetData.user.handle));

  $section.append($('<p>').text(tweetData.content.text));

  $footer.append($('<h5>')).addClass('days').text(time);
  $footer.append($footer_buttons);

  $tweet.append($header);
  $tweet.append($section);
  $tweet.append($footer);

  return $tweet;
}

function loadTweets() {
  $.get( '/tweets')
  .done(function(result) {
    $('#tweets-container').empty();
    renderTweets(result);
  })
  .fail(function(error) {
    console.error(error)
  });
}

function toggleNewTweetTextArea() {
  $('.compose').on('click', function(event) {
    $('.new-tweet').slideToggle(300);
    $('.textarea').select();
    $(window).scrollTop(0);
  });
}

function isUserActive() {
  $.get("/users/active", (session) =>{
    if (session) {
      console.log(typeof(session));
      $(".logout").hide();
    } else {
      $(".login").hide();
    }
  });
}

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

$(document).ready(function() {

   isUserActive();

  loadTweets();

// liking Tweets
  $("#tweets-container").on("click", ".like_button", function( event ) {
     $totalLikes = $(this).data("likes", $(this).data("likes")+1);
     $(this).siblings(".num-likes").text($(this).data("likes"));
  });

  $(".logout").on("click", function( event ) {
    $.post("users/logout")
    .done(function (result) {
      $(".logout").hide();
      $(".login").show();
    });
  });



//Submit new tweet to database
  $("form" ).on( "submit", function( event ) {
    event.preventDefault();
    var textInput = $(event.target).serialize();
    var inputValue = $("form").find("textarea").val();

    if(inputValue === null || inputValue === '') {
      alert("Tweet is empty!!! ");
      return;
    } else if (inputValue.length > 140){
      alert("Maximum message length is 140.");
      return;
    }

    $.post("/tweets", textInput)
    .done(function(result){
      $(".textarea").val("");
      $(".counter").text('140');
      loadTweets();
    })
    .fail(function(error){
      console.log(error);
    });
  });

  toggleNewTweetTextArea();

});
