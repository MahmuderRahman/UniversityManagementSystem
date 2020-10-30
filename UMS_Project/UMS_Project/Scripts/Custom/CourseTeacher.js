var _id = null;
var dataTable = null;
$(document).ready(function () {

    Manager.GetDataForTable(0);

    Manager.LoadDepartmentDDL();

    Manager.LoadCourseCodeDDL();

    //$('#saveBtn').click(function () {
    //    Manager.SaveCourseTeacher();
    //});

    //$('#editBtn').click(function() {
    //    Manager.EditCourseTeacher();
    //});

    //$('#clearBtn').click(function () {
    //    Manager.ResetForm();
    //});


    $('#departmentDDL').change(function () {
        var departmentId = $(this).val();
        if (departmentId > 0) {
            Manager.LoadTeacherDDL(departmentId);
        }
        else {
            $('#teacherDDL').empty();
            $('#totalCredit').val('');
            $('#remainingCredit').val('');
        }
    });

    $('#departmentDDL').change(function () {
        var departmentId = $(this).val();
        if (departmentId > 0) {
            Manager.LoadCourseCodeDDL(departmentId);
        }
    });
    
    $('#courseDDL').change(function () {
        var code = $(this).val();
        if (code > 0) {

            Manager.GetCourseInfoByCode(code);
        }
    });

    $('#teacherDDL').change(function () {
        var tcrId = $(this).val();
        if (tcrId > 0) {
            Manager.TeacherCreditInfo(tcrId);
        }
        else {
            $('#totalCredit').val('');
            $('#remainingCredit').val('');
        }
    });
   
});

var Manager = {

    ResetForm: function () {
        $('#courseTeacherForm')[0].reset();
    },

    AssignCourseTeacher: function () {
        if (Message.Prompt()) {
            var jsonParam = $('#courseTeacherForm').serialize();
            var serviceURL = "/CourseTeacher/SaveCourseTeacher/";
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

    //EditCourseTeacher: function (id) {
    //    if (Message.Prompt()) {
    //        var jsonParam = $('#courseTeacherForm').serialize() + '&Id= ' + id;
    //        var serviceURL = "/CourseTeacher/EditCourseTeacher/";
    //        AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
    //    }
    //    function onSuccess(JsonData) {
    //        if (JsonData == "200") {
    //            Manager.ResetForm();
    //            $('#myModal').modal('hide');
    //            Message.Success("update");
    //            Manager.GetDataForTable(1);

    //        }
    //        else {
    //            Message.Warning(JsonData);
    //        }
    //    }

    //    function onFailed(xhr, status, err) {
    //        Message.Exception(xhr);
    //    }
    //},

    DeleteCourseTeacher: function (id) {
        if (confirm('Are you sure that you want to do it?')) {
            var jsonParam = { courseTeacherId: id };
            var serviceURL = "/CourseTeacher/DeleteCourseTeacher/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(JsonData) {
            if (JsonData == "200") {
                Message.Success("delete");
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

    LoadDepartmentDDL: function () {
        var serviceUrl = '/CourseTeacher/GetDepartmentInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('departmentDDL', jsonData, "Select Department");
        }

        function onFailed() {
        }
    },

    LoadTeacherDDL: function (dptId) {
        var serviceUrl = '/CourseTeacher/GetTeacherByDepartment/';
        var jsonParam = { departmentId: dptId };
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('teacherDDL', jsonData, "Select Teacher");
        }

        function onFailed() {
        }
    },

    LoadCourseCodeDDL: function (dptId) {
        var serviceUrl = '/CourseTeacher/GetCourseByDepartment/';
        var jsonParam = { courseId: dptId };
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('courseDDL', jsonData, "Select Course Code");
        }

        function onFailed() {
        }
    },

    TeacherCreditInfo: function (tcrId) {
        $.ajax({
            url: '/CourseTeacher/GetTeacherCreditInfo/',
            type: "POST",
            data: { teacherId: tcrId },
            datatype: "Json",
            success: function (jsonData) {
                $('#totalCredit').val(jsonData.totalCredit);
                $('#remainingCredit').val(jsonData.remainingCredit);
            },
            error: function () {
                alert("Failed");
            }
        });
    },

    GetCourseInfoByCode: function (code) {
        $.ajax({
            url: '/CourseTeacher/GetCourseInfoByCode/',
            type: "POST",
            data: { code: code },
            datatype: "Json",
            success: function (jsonData) {
                $('#nameText').val(jsonData.Name);
                $('#creditText').val(jsonData.Credit);
            },
            error: function () {

            }
        });
    },

    GetDataForTable: function (refresh) {
        var jsonParam = '';
        var serviceURL = "/CourseTeacher/GetCourseTeachers/";
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
                        data: 'DepartmentName',
                        name: 'DepartmentName',
                        title: 'Department Name',
                        width: '90'
                    },
                    {
                        data: 'TeacherName',
                        name: 'TeacherName',
                        title: 'Teacher Name',
                        width: '75'
                    },
                    {
                        data: 'TotalCredit',
                        name: 'TotalCredit',
                        title: 'Total Credit',
                        width: 55
                    },
                    {
                        data: 'RemainingCredit',
                        name: 'RemainingCredit',
                        title: 'Remaining Credit',
                        width: 90
                    },
                    {
                        data: 'CouraseCode',
                        name: 'CouraseCode',
                        title: 'Courase Code',
                        width: 70
                    },
                    {
                        data: 'Name',
                        name: 'Name',
                        title: 'Name',
                        width: 110
                    },
                    {
                        data: 'Credit',
                        name: 'Credit',
                        title: 'Credit',
                        width: 30
                    },
                    {
                        name: 'Option',
                        title: 'Option',
                        width: 60,

                        render: function (data, type, row) {
                            //var editIcon = '<button class="btn btn-sm btn-warning editIcon">Edit</button>';
                            var deleteIcon = '<button style="margin-left:5px" class="btn btn-sm btn-danger deleteIcon">Delete</button>';
                            //return editIcon + deleteIcon;
                            return deleteIcon;
                        }
                    }
                ],

                data: data
            });
        }
        else {
            dTable.clear().rows.add(data).draw(_id);
        }
    }

}

$(document).on('click', '#assignButton', function () {
    Manager.AssignCourseTeacher();
});

$("#myModal").on('hidden.bs.modal', function () {
    Manager.ResetForm();
    $('#editButton').text('Save');
    $('#editButton').removeClass('btn-warning');
    $('#editButton').addClass('btn-success');
    $('#editButton').prop('id', 'assignButton');
});

//$(document).on('click', '.editIcon', function () {
//    var rowData = dTable.row($(this).parents()).data();
//    $('#departmentDDL').val(rowData.DepartmentId);
//    $('#teacherddl').val(rowdata.teacherid);
//    $('#totalcredit').val(rowdata.totalcredit);
//    $('#remainingcredit').val(rowdata.remainingcredit);
//    $('#courseddl').val(rowdata.courseid);
//    $('#nameText').val(rowdata.name);
//    $('#creditText').val(rowdata.credit);
//    _id = rowData.Id;

//    $('#assignButton').text('Update');
//    $('#assignButton').removeClass('btn-success');
//    $('#assignButton').addClass('btn-warning');
//    $('#assignButton').prop('id', 'editButton');
//    $('#myModal').modal('show');
//});

//$(document).on('click', '#editButton', function () {
//    Manager.EditCourseTeacher(_id);
//});

$(document).on('click', '.deleteIcon', function () {
    _id = dTable.row($(this).parents('tr')).data().Id;
    Manager.DeleteCourseTeacher(_id);
});

//$(document).on('click', '.editIcon', function () {

//    var rowData = dTable.row($(this).parents()).data();
//    $('#departmentDDL').val(rowData.DepartmentId);
//    $('#teacherDDL').val(rowData.TeacherId);
//    $('#totalCredit').val(rowData.TotalCredit);
//    $('#remainingCredit').val(rowData.RemainingCredit);
//    $('#courseDDL').val(rowData.CourseId);
//    $('#nameText').val(rowData.Name);
//    $('#creditText').val(rowData.Credit);
//    _id = rowData.Id;
//}),

//$(document).on('click', '.deleteIcon', function () {
//    _id = dTable.row($(this).parents('tr')).data().Id;
//    Manager.DeleteCourseTeacher(_id);
//});
