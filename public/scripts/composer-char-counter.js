"use strict";

//As you can tell from the name, this file will be solely responsible for this character counter.

// TextField must be textarea
function charCount(textField, countView, maxCharNum) {
  $(textField).find(countView).text(maxCharNum);

  $(textField).on('keydown', function() {
      var wordCount = maxCharNum - (+$(this).find('textarea').val().length);

      if( wordCount < 0 ) {
        $(this).find(countView).removeClass('positive');
        $(this).find(countView).addClass('negative');

      } else {
        $(this).find(countView).removeClass('negative');
        $(this).find(countView).addClass('positive');
      }

      $(this).find(countView).text(wordCount);
  });
}

$(function() {
  charCount('.new-tweet', '.counter', 140);
});
