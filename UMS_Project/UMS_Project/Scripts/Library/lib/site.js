var dtpDTFomat = "m/d/Y";
var dtpDTFomat1 = "d-m-Y";
var dtpDMYFomat = "d-m-Y";
var dtpTimeFomat = "h:m:t";
var dtFormat = "mm/dd/yyyy";
var timeFormat = "HH:mm tt";
var dttimeFormate = "m/d/y H:i:s";
var dtpTime = "H:i";

function num_only(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        Message.Warning("Only numbers allowed.");
        return false;
    }
    return true;
};

var NotificationManager = {
    StartProcessBar: function () {
        var div = "<div id='ui_waitingbar' style='position: fixed;z-index: 1;padding-top: 20%;top: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.18);left:0'><p style='width: 82px;text-align: center;background: #fff;border-radius: 55px;padding: 4px 0;margin: 0 auto;box-shadow: 2px 2px 15px #807b79;'><img height='70px' src='/Content/Image/Progress_Bar/processbar2.gif' /></p></div>";
        $("body").append(div);
    },
    EndProcessBar: function () {
        $("#ui_waitingbar").remove();
    }
};

$(document).ready(function () {
    $('.pickDate').datetimepicker({
        timepicker: false,
        format: 'm/d/Y'
    });

    $('.pickTime').datetimepicker({
        datepicker: false,
        format: 'H:i'
    });
});

function cl(value) {
    console.log(value);
}




