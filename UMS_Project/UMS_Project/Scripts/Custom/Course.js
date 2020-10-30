var _id = null;
var dTable = null;
$(document).ready(function () {

    Manager.GetDataForTable(0);

    Manager.LoadDepartmentDDL();

    Manager.LoadSemesterDDL();

    //$('#saveButton').click(function () {
    //    Manager.SaveCourse();
    //});
    //$('#editButton').click(function () {
    //    Manager.EditCourse(_id);
    //});
    //$('#clearButton').click(function () {
    //    Manager.ResetForm();
    //});

});

var Manager = {

    ResetForm: function () {
        $('#courseForm')[0].reset();
    },

    SaveCourse: function () {
        if (!$('#codeText').val()) {
            Message.Warning("Code is required");
        }
        else if (!$('#nameText').val()) {
            Message.Warning("Name is required");
        }
        else if ($('#creditText').val()<0.5 ||$('#creditText').val() > 5.0) {
            Message.Warning("Credit range is from 0.5 to 5.0");
        }

        else if (Message.Prompt()) {
            var jsonParam = $('#courseForm').serialize();
            var serviceURL = "/Course/SaveCourse/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);

            function onSuccess(JsonData) {
                if (JsonData =="200") {
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
        }
    },

    EditCourse: function (id) {

        if (!$('#codeText').val()) {
            Message.Warning("Code is required");
        }
        else if (!$('#nameText').val()) {
            Message.Warning("Name is required");
        }
        else if ($('#creditText').val() < 0.5 || $('#creditText').val() > 5.0) {
            Message.Warning("Credit range is from 0.5 to 5.0");
        }
        else if (Message.Prompt()) {
            var jsonParam = $('#courseForm').serialize() + '&Id=' + id;
            var serviceURL = "/Course/EditCourse/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);

            function onSuccess(JsonData) {
                if (JsonData =="200") {
                    Manager.ResetForm();
                    $('#myModal').modal('hide');
                    Message.Success("update");
                    Manager.GetDataForTable(1);
                }
                else {
                    Message.Warning(JsonData);
                }
            }

            function onFailed(xhr, status, err) {
                Message.Exception(xhr);
            }
        }
    },

    DeleteCourse: function (id) {
        if (confirm('Are you sure that you want to do it?')) {
            var jsonParam = { courseId: id };
            var serviceURL = "/Course/DeleteCourse/";
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
        var serviceUrl = '/Course/GetDepartmentInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('departmentDDL', jsonData, "Select Department");
        }
        function onFailed() {
        }
    },

    LoadSemesterDDL: function () {
        var serviceUrl = '/Course/GetSemesterInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('semestertDDL', jsonData, "Select Semester");
        }
        function onFailed() {
        }
    },

    GetDataForTable: function (refresh) {
        var jsonParam = '';
        var serviceURL = "/Course/GetCourses/";
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
                          data: 'Code',
                          name: 'Code',
                          title: 'Code',
                          width: 80
                      },

                       {
                           data: 'Name',
                           name: 'Name',
                           title: 'Name',
                           width: 120
                       },

                       {
                           data: 'Credit',
                           name: 'Credit',
                           title: 'Credit',
                           width: 50
                       },

                        {
                            data: 'Description',
                            name: 'Description',
                            title: 'Description',
                            width: 120
                        },

                         {
                             data: 'DepartmentName',
                             name: 'DepartmentName',
                             title: 'Department',
                             width: 130
                         },

                          {
                              data: 'SemesterName',
                              name: 'SemesterName',
                              title: 'Semester',
                              width: 170
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
    }
}

$(document).on('click', '#saveButton', function () {
    Manager.SaveCourse();
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
    $('#codeText').val(rowData.Code);
    $('#nameText').val(rowData.Name);
    $('#creditText').val(rowData.Credit);
    $('#descriptionText').val(rowData.Description);
    $('#departmentDDL').val(rowData.DepartmentId);
    $('#semestertDDL').val(rowData.SemesterId);
    _id = rowData.Id;

    $('#saveButton').text('Update');
    $('#saveButton').removeClass('btn-success');
    $('#saveButton').addClass('btn-warning');
    $('#saveButton').prop('id', 'editButton');
    $('#myModal').modal('show');
});

$(document).on('click', '#editButton', function () {
    Manager.EditCourse(_id);
});

$(document).on('click', '.deleteIcon', function () {
    _id = dTable.row($(this).parents('tr')).data().Id;
    Manager.DeleteCourse(_id);
});

//$(document).on('click', '.editIcon', function () {
//    var rowData = dTable.row($(this).parents()).data();
//    $('#codeText').val(rowData.Code);
//    $('#nameTxt').val(rowData.Name);
//    $('#creditTxt').val(rowData.Credit);
//    $('#descriptionTxt').val(rowData.Description);
//    $('#departmentDDL').val(rowData.DepartmentId);
//    $('#semestertDDL').val(rowData.SemesterId);
//    _id = rowData.Id;
//}),

//$(document).on('click', '.deleteIcon', function () {
//    _id = dTable.row($(this).parents('tr')).data().Id;
//    Manager.DeleteCourse(_id);
//});

