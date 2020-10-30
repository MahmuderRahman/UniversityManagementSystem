$(document).ready(function () {
    $('.datePicker').datetimepicker({
        timepicker: false,
        format: "m/d/Y"
    });

    $('.dateTimePicker').datetimepicker({
        format: "m/d/Y H:i"
    });

    $('.timePicker').datetimepicker({
        datepicker: false,
        format: "H:i"
    });

});

$(document).on("click", ".editableStyle",function() {
    $('.datePicker').datetimepicker({
        timepicker: false,
        format: "m/d/Y"
    });
})