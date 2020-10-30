$(document).ready(function () {
    Manager.LoadRegistrationNoInfoDDL();

    $('#regNoIdDDL').change(function() {
        var regNo = $(this).val();
        if (regNo>0) {
            Manager.GetViewResultInfoByRegNo(regNo);
        }

    });
});

var Manager = {
    LoadRegistrationNoInfoDDL: function () {
        var serviceUrl = '/ViewResult/GetRegistrationNoInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('regNoIdDDL', jsonData, "Select RegistrationNo");
        }

        function onFailed() {
        }
    },

    GetViewResultInfoByRegNo: function (regNo) {
        $.ajax({
            url: '/ViewResult/GetRegisterStudentByRegNoInfo/',
            type: "POST",
            data: { RegNo: regNo },
            datatype: "Json",
            success: function (jsonData) {
                $('#name').val(jsonData.Name);
                $('#email').val(jsonData.Email);
                $('#department').val(jsonData.DepartmentName);
            },
            error: function () {

            }
        });
    }
}

