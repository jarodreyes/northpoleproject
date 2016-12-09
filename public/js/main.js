$(document).ready(function() {
    // Power JS close for info messages
    setInterval(function() {
        blinkBeacon($('#b1'));
    }, 1000);
    setTimeout(function() {
      setInterval(function() {
        blinkBeacon($('#b2'));
      }, 750);
    }, 700);
    setTimeout(function() {
      setInterval(function() {
        blinkBeacon($('#b3'));
      }, 1000);
    }, 1300);

    $('.signup-button').click(function(e) {
      e.preventDefault();
      $('.c-overlay').show();
      $('.light-form').addClass('show');
    });

    $('.c-overlay').click(function(e) {
      $('.c-overlay').hide();
      $('.light-form').removeClass('show');
    })
});

var blinkBeacon = function(el) {
  el.toggleClass('grow');
  setTimeout(function() {
    el.toggleClass('fade-out');
  },500);
}

