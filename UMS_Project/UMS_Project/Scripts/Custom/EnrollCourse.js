var _id = null;
var dTable = null;
$(document).ready(function () {
    Manager.GetDataForTable(0);

    Manager.LoadRegistrationNoDDL();

    Manager.LoadCourseInfoDDL();

    $('#regNoIdDDL').change(function () {
        var regNo = $(this).val();
        if (regNo > 0) {
            Manager.GetEnrollCourseInfoByRegNo(regNo);
        }
    });
});

var Manager = {

    ResetForm:function() {
        $('#enrollCourseForm')[0].reset();
    },

    SaveEnrollCourse: function () {
        if (Message.Prompt()) {
            var jsonParam = $('#enrollCourseForm').serialize();
            var serviceURL = "/EnrollCourse/SaveEnrollCourse/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        }

        function onSuccess(JsonData) {
            if (JsonData == "200") {
                Manager.ResetForm();
                $('#myModal').modal('hide');
                Message.Success("save");
                Manager.GetDataForTable(1);
            } else {
                Message.Warning(JsonData);          
            }
        }

        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    EditEnrollCourse: function (id) {
        if (Message.Prompt()) {
            var jsonParam = $('#enrollCourseForm').serialize() + '&Id=' + id;
            var serviceURL = "/EnrollCourse/EditEnrollCourse/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        } 

            function onSuccess(JsonData) {
                if (JsonData == "200") {
                    Manager.ResetForm();
                    $('#myModal').modal('hide');
                    Message.Success("update");
                    Manager.GetDataForTable(1);
                } else {
                    Message.Warning(JsonData);
                }
            }
            function onFailed(xhr, status, err) {
                Message.Exception(xhr);
            }
    },

    DeleteEnrollCourse: function (id) {
        if (confirm('Are you sure that you want to do it?')) {
            var jsonParam = { enrollCourseId: id };
            var serviceURL = "/EnrollCourse/DeleteEnrollCourse/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        }
    
        function onSuccess(JsonData) {
            if (JsonData == "200") {
                Message.Success("delete");
                Manager.GetDataForTable(1);
            } else {
                Message.Warning(JsonData);
            }
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    LoadRegistrationNoDDL: function () {
        var serviceUrl = '/EnrollCourse/GetRegistrationNoInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('regNoIdDDL', jsonData, "Select RegistrationNo");
        }

        function onFailed() {
        }
    },

    LoadCourseInfoDDL: function () {
        var serviceUrl = '/EnrollCourse/GetCourseInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('courseIdDDL', jsonData, "Select Course");
        }

        function onFailed() {
        }
    },

    GetEnrollCourseInfoByRegNo: function (regNo) {
        $.ajax({
            url: '/EnrollCourse/GetRegisterStudentByRegNoInfo/',
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
    },

    GetDataForTable: function (refresh) {
        var jsonParam = '';
        var serviceURL = "/EnrollCourse/GetEnrollCourseInfo/";
        AjaxManager.SendJsonAsyncON(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            Manager.LoadDataTable(jsonData, refresh);
        }

        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    LoadDataTable: function (data, refresh) {
        if (refresh == "0") {
            dTable = $('#tableElement').DataTable({
                lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20, "All"]],
                columnDefs: [
                    { visible: false, targets: [] },
                    { className: "dt-center", targets: [0, 1, 2, 3, 4, 5, 6] }
                ],
                columns: [
                    {
                        data: 'RegistrationNumber',
                        name: 'RegistrationNumber',
                        title: 'RegistrationNumber',
                        width: 100
                    },


                      {
                          data: 'StudentName',
                          name: 'StudentName',
                          title: 'StudentName',
                          width: 100
                      },

                      {
                          data: 'Email',
                          name: 'Email',
                          title: 'Email',
                          width: 150
                      },

                       {
                           data: 'DepartmentName',
                           name: 'DepartmentName',
                           title: 'DepartmentName',
                           width: 50
                       },


                           {
                               data: 'CourseName',
                               name: 'CourseName',
                               title: 'CourseName',
                               width: 120
                           },


                        {
                            data: 'Date',
                            name: 'Date',
                            title: 'Date',
                            width: 80,
                            render: function (cellValue, type, row) {
                                return Manager.FormatDateToDayMonthYear(cellValue);
                            }
                        },

                    {
                        name: 'Option',
                        title: 'Option',
                        width: 100,

                        render: function (data, type, row) {
                            var editIcon = '<button class="btn btn-sm btn-warning editIcon">Edit</button>';
                            var deleteIcon = '<button style="margin-left:5px" class="btn btn-sm btn-danger deleteIcon">Delete</button>';
                            return editIcon + deleteIcon;
                        }
                    }

                ],
                data: data
            });
        } else {
            dTable.clear().rows.add(data).draw();
        }
    },

    FormatDateToDayMonthYear: function (date) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var dateObject = new Date(date);
        var day = ("0" + dateObject.getDate()).slice(-2);
        var month = dateObject.getMonth();

        return (day) + "-" + (monthNames[month]) + "-" + dateObject.getFullYear();
    },

    FormatDateToYearMonthDay: function (date) {
        var dateObject = new Date(date);
        var day = ("0" + dateObject.getDate()).slice(-2);
        var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);

        return dateObject.getFullYear() + "-" + (month) + "-" + (day);
    }
}


$(document).on('click', '#saveButton', function () {
    Manager.SaveEnrollCourse();
});

$("#myModal").on('hidden.bs.modal', function () {
    Manager.ResetForm();
    $('#editButton').text('Save');
    $('#editButton').removeClass('btn-warning');
    $('#editButton').addClass('btn-success');
    $('#editButton').prop('id', 'saveButton');
});

$(document).on('click', '.editIcon', function () {
    var rowData = dTable.row($(this).parents()).data();
    $('#regNoIdDDL').val(rowData.RegNoId);
    $('#name').val(rowData.StudentName);
    $('#email').val(rowData.Email);
    $('#department').val(rowData.DepartmentName);
    $('#courseIdDDL').val(rowData.CourseId);
    $('#date').val(rowData.Date);
    _id = rowData.Id;

    $('#saveButton').text('Update');
    $('#saveButton').removeClass('btn-success');
    $('#saveButton').addClass('btn-warning');
    $('#saveButton').prop('id', 'editButton');
    $('#myModal').modal('show');
});

$(document).on('click', '#editButton', function () {
    Manager.EditEnrollCourse(_id);
});

$(document).on('click', '.deleteIcon', function () {
    _id = dTable.row($(this).parents('tr')).data().Id;
    Manager.DeleteEnrollCourse(_id);
});


//$(document).on('click', '.editIcon', function() {
//    var rowData = dTable.row($(this).parents()).data();
//    var formattedDate = Manager.FormatDateToYearMonthDay(rowData.Date);
//    $('#regNoIdDDL').val(rowData.RegNoId);
//    $('#name').val(rowData.StudentName);
//    $('#email').val(rowData.Email);
//    $('#department').val(rowData.DepartmentName);
//    $('#courseIdDDL').val(rowData.CourseId);
//    $('#date').val(formattedDate);
//    _id = rowData.Id;
//});

//$(document).on('click', '.deleteIcon', function () {
//    _id = dTable.row($(this).parents('tr')).data().Id;
//    Manager.DeleteEnrollCourse(_id);
//});