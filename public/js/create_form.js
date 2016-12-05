$(document).ready(function() {
    // Authy's form helpers clobber our Twitter Bootstrap styles - run a script
    // to quickly repair the visible form field
    setTimeout(function() {
        $('.countries-input').addClass('form-control');
    }, 50);
    var localTime = moment.tz.guess();
    var now = moment().add(2, 'minutes');
    $(".phone").mask("999-999-9999");
    $("#inputDate").datetimepicker({
      sideBySide: true,
      defaultDate: now,
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
    $("#inputDate").data('DateTimePicker').date(now);
    $("#selectTimeZone").chosen();
    $('#selectTimeZone').val(localTime);
    $('#selectTimeZone').trigger("chosen:updated");
});