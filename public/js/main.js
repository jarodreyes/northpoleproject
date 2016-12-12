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

    // $('.signup-button').click(function(e) {
    //   e.preventDefault();
    //   $('.c-overlay').show();
    //   $('.light-form').addClass('show');
    // });

    // $('.c-overlay').click(function(e) {
    //   $('.c-overlay').hide();
    //   $('.light-form').removeClass('show');
    // });
    // $('#signup').submit(function(e) {
    //   e.preventDefault();
    //   $.ajax({
    //     type: "POST",
    //     url: '/users',
    //     data: $('#signup').serialize(),
    //     error: function(errors) {
    //       return showErrors(errors.responseText);
    //     },
    //     success: function(data) {
    //       $('.messages').removeClass('error').text('');
    //       return addVerify(data);
    //     }
    //   });
    // })
});

var blinkBeacon = function(el) {
  el.toggleClass('grow');
  setTimeout(function() {
    el.toggleClass('fade-out');
  },500);
}

// var addVerify = function(data) {
//   console.log(data);
//   $('#verify').submit(function(e) {
//     e.preventDefault();
//     $.ajax({
//       type: "POST",
//       url: '/users/'+data.id+'/verify',
//       data: $('#verify').serialize(),
//       error: function(e) {
//         return showErrors(e.response);
//       },
//       success: function(data) {
//         $('.messages').removeClass('error').text('');
//         return showElf(data);
//       }
//     });
//   })
//   $('#signup-form').addClass('hide');
//   return $('#verify-form').removeClass('hide');
// }

// var showElf = function(data) {
//   console.log(data);
// }

// var showErrors = function(e) {
//   console.log("Error: " + e);
//   $('.messages').addClass('error').text(e);
//   return;
//   // return $('.register-error').fadeIn(300).text(e);
// }

