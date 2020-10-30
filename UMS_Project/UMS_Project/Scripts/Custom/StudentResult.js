var _id = null;
var dTable = null;
$(document).ready(function () {

    Manager.GetDataForTable(0);

    Manager.LoadRegistrationNoInfoDDL();

    Manager.LoadCourseInfoDDL();

    Manager.LoadGradeLetterInfoDDL();

    $('#regNoIdDDL').change(function() {
        var regNo = $(this).val();
        if (regNo>0) {
            Manager.GetStudentResultInfoByRegNo(regNo);
        }

    });
});

var Manager = {
    ResetForm: function() {
        $('#studentResultForm')[0].reset();
    },

    SaveStudentResult: function () {
        if (Message.Prompt()) {
            var jsonParam = $('#studentResultForm').serialize();
            var serviceURL = "/StudentResult/SaveStudentResult/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(JsonData) {
            if (JsonData == "200") {
            Manager.ResetForm();
            $('#myModal').modal('hide');
            Message.Success("save");
            Manager.GetDataForTable(1);
        } 
        else {
            Message.Warning(JsonData);
        }
        }

        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    EditStudentResult: function (id) {
        if (Message.Prompt()) {
            var jsonParam = $('#studentResultForm').serialize() + '&Id=' + id;
            var serviceURL = "/StudentResult/EditStudentResult/";
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

    DeleteStudentResult: function (id) {
        if (confirm('Are you sure that you want to do it?')) {
            var jsonParam = { studentResultId: id };
            var serviceURL = "/StudentResult/DeleteStudentResult/";
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

    LoadRegistrationNoInfoDDL: function () {
        var serviceUrl = '/StudentResult/GetRegistrationNoInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('regNoIdDDL', jsonData, "Select RegistrationNo");
        }

        function onFailed() {
        }
    },

    LoadCourseInfoDDL: function () {
        var serviceUrl = '/StudentResult/GetCourseInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('courseIdDDL', jsonData, "Select Course");
        }

        function onFailed() {
        }
    },

    LoadGradeLetterInfoDDL: function () {
        var serviceUrl = '/StudentResult/GetGradeLetterInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('gradeLetterIdDDL', jsonData, "Select Grade Letter");
        }

        function onFailed() {
        }
    },

    GetStudentResultInfoByRegNo: function (regNo) {
        $.ajax({
            url: '/StudentResult/GetRegisterStudentByRegNoInfo/',
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
        var serviceURL = "/StudentResult/GetStudentResultInfo/";
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
                        title: 'Registration Number',
                        width: 120
                    },


                      {
                          data: 'StudentName',
                          name: 'StudentName',
                          title: 'Student Name',
                          width: 100
                      },

                      {
                          data: 'Email',
                          name: 'Email',
                          title: 'Email',
                          width: 100
                      },

                       {
                           data: 'DepartmentName',
                           name: 'DepartmentName',
                           title: 'Department Name',
                           width: 120
                       },


                           {
                               data: 'CourseName',
                               name: 'CourseName',
                               title: 'Course Name',
                               width: 120
                           },


                        {
                            data: 'GradeLetter',
                            name: 'GradeLetter',
                            title: 'Grade Letter',
                            width: 80
                        },

                    {
                        name: 'Option',
                        title: 'Option',
                        width: 80,

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
}
$(document).on('click', '#saveButton', function () {
    Manager.SaveStudentResult();
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
    $('#gradeLetterIdDDL').val(rowData.GradeLetterId);
    _id = rowData.Id;

    $('#saveButton').text('Update');
    $('#saveButton').removeClass('btn-success');
    $('#saveButton').addClass('btn-warning');
    $('#saveButton').prop('id', 'editButton');
    $('#myModal').modal('show');
});

$(document).on('click', '#editButton', function () {
    Manager.EditStudentResult(_id);
});

$(document).on('click', '.deleteIcon', function () {
    _id = dTable.row($(this).parents('tr')).data().Id;
    Manager.DeleteStudentResult(_id);
});



//$(document).on('click', '.editIcon', function() {
//    var rowData = dTable.row($(this).parents()).data();
//    $('#regNoIdDDL').val(rowData.RegNoId);
//    $('#name').val(rowData.StudentName);
//    $('#email').val(rowData.Email);
//    $('#department').val(rowData.DepartmentName);
//    $('#courseIdDDL').val(rowData.CourseId);
//    $('#gradeLetterIdDDL').val(rowData.GradeLetterId);
//    _id = rowData.Id;
//});

//$(document).on('click', '.deleteIcon', function () {
//    _id = dTable.row($(this).parents('tr')).data().Id;
//    Manager.DeleteStudentResult(_id);
//});
