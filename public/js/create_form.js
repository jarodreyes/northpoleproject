$(document).ready(function() {
    // Authy's form helpers clobber our Twitter Bootstrap styles - run a script
    // to quickly repair the visible form field
    setTimeout(function() {
        $('.countries-input').addClass('form-control');
    }, 50);
    $(".phone").mask("999-999-9999");
    $("#inputDate").datetimepicker({
      sideBySide: true,
      format: "MM-DD-YYYY hh:mma",
      icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
        }
    });
    $("#selectTimeZone").chosen();
});