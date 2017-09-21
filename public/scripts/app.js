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
  var time = moment(tweetData.created_at).fromNow();

  var $tweet = $('<article>').addClass('tweet');
  var $header = $('<header>');
  var $section = $('<section>');
  var $footer = $('<footer>');
  var $icons = `<i class="fa fa-flag" aria-hidden="true"></i>
                <i class="fa fa-retweet" aria-hidden="true"></i>
                <i class="fa fa-heart" aria-hidden="true"></i>`;


  $header.append($('<img>').addClass('icon').attr('src', tweetData.user.avatars.small));
  $header.append($('<h3>').text(tweetData.user.name));
  $header.append($('<p>').text(tweetData.user.handle));

  $section.append($('<p>').text(tweetData.content.text));

  $footer.append($('h5')).addClass('days').text(time)
  $footer.append($('<div>').addClass('edit-icons').html($icons));

  $tweet.append($header);
  $tweet.append($section);
  $tweet.append($footer);

  return $tweet;
}

function loadTweets() {
  $.get( '/tweets/')
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
  });
}

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

$(document).ready(function() {

  loadTweets();

  $("form" ).on( "submit", function( event ) {
    event.preventDefault();
    var textInput = $(event.target).serialize();
    var inputValue = $("form").find("textarea").val();

    if(inputValue === null || inputValue === '') {
      alert("Tweet is empty!!! ");

    } else if (inputValue.length > 140){
      alert("Maximum message length is 140.");

    } else {
      $.post("/tweets/", textInput)
      .done(function(result){
        loadTweets();
        $(".textarea").val('');
      })
      .fail(function(error){
        console.log(error);
      });
    }
  });

  toggleNewTweetTextArea();

});
