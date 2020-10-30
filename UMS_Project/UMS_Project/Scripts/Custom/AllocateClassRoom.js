var _id = null;
var dTable = null;
$(document).ready(function () {

    Manager.GetDataForTable(0);

    Manager.LoadDepartmentDDL();

    Manager.LoadCourseDDL();

    Manager.LoadRoomNumberDDL();

    Manager.LoadDayDDL();

});

var Manager = {

    ResetForm: function () {
        $('#allocateClassRoomForm')[0].reset();
    },

    SaveAllocateClassRoom: function () {
        if (Message.Prompt()) {
            var jsonParam = $('#allocateClassRoomForm').serialize();
            var serviceURL = "/AllocateClassRoom/SaveAllocateClassRoom/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        }      

        function onSuccess(JsonData) {
            if (JsonData=="200") {
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

    EditAllocateClassRoom: function (id) {
        if (Message.Prompt()) {
            var jsonParam = $('#allocateClassRoomForm').serialize() + '&Id=' + id;
            var serviceURL = "/AllocateClassRoom/EditAllocateClassRoom/";
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

    DeleteAllocateClassRoom: function (id) {
        if (confirm('Are you sure that you want to do it?')) {
            var jsonParam = { allocateClsRmId: id };
            var serviceURL = "/AllocateClassRoom/DeleteAllocateClassRoom/";
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

    LoadDepartmentDDL: function () {
        var serviceUrl = '/AllocateClassRoom/GetDepartmentInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('departmentDDL', jsonData, "Select Department");
        }
        function onFailed() {
        }
    },

    LoadCourseDDL: function () {
        var serviceUrl = '/AllocateClassRoom/GetCourseInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('courseDDL', jsonData, "Select Course");
        }
        function onFailed() {
        }
    },

    LoadRoomNumberDDL: function () {
        var serviceUrl = '/AllocateClassRoom/GetRoomNoInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('roomNoDDL', jsonData, "Select Room Number");
        }
        function onFailed() {
        }
    },

    LoadDayDDL: function () {
        var serviceUrl = '/AllocateClassRoom/GetDayInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('dayDDL', jsonData, "Select Day");
        }
        function onFailed() {
        }
    },

    GetDataForTable: function (refresh) {
        var jsonParam = '';
        var serviceURL = "/AllocateClassRoom/GetAllocateClassRoomInfo/";
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
                        width: 120
                    },


                      {
                          data: 'CourseName',
                          name: 'CourseName',
                          title: 'Course Name',
                          width: 120
                      },

                       {
                           data: 'RoomNumber',
                           name: 'RoomNumber',
                           title: 'Room Number',
                           width: 100
                       },

                        {
                            data: 'DayName',
                            name: 'DayName',
                            title: 'DayName',
                            width: 100
                        },

                         {
                             data: 'StartTime',
                             name: 'StartTime',
                             title: 'Start Time',
                             width: 90,
                             render: function (data, type, row) {
                                 var date = moment(data);
                                 return date.format("LLL");
                             }
                         },

                          {
                              data: 'EndTime',
                              name: 'EndTime',
                              title: 'End Time',
                              width: 90,
                              render: function (data, type, row) {
                                  var date = moment(data);
                                  return date.format("LLL");
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
    }
}

$(document).on('click', '#saveButton', function () {
    Manager.SaveAllocateClassRoom();
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
    $('#departmentDDL').val(rowData.DepartmentId);
    $('#courseDDL').val(rowData.CourseId);
    $('#roomNoDDL').val(rowData.RoomNoId);
    $('#dayDDL').val(rowData.DayId);

    //var da = moment(rowData.StartTime);
    //var dae = moment(rowData.EndTime);
    //var beginningdatetime = da.format('YYYY-MM-DD HH:mm');
    //var enddatetime = dae.format('YYYY-MM-DD HH:mm');
    //var d2 = enddatetime.toString().split(' ');
    //var d = beginningdatetime.toString().split(' ');
    //$('#beginningdateTxt').val(d[0]);
    var da = moment(rowData.StartTime);
    var dae = moment(rowData.EndTime);
    var startdatetime = da.format('YYYY-MM-DD HH:mm');
    var enddatetime = dae.format('YYYY-MM-DD HH:mm');
    var d = startdatetime.toString().split(' ');
    var d2 = enddatetime.toString().split(' ');    
    //$('#startdatetime').val(d[0]);
    //$('#enddatetime').val(d[0]);
    $('#startTime').val(d[1]);
    $('#endTime').val(d2[1]);

    //$('#startTime').val(rowData.StartTime);
    //$('#endTime').val(rowData.EndTime);
    _id = rowData.Id;

    $('#saveButton').text('Update');
    $('#saveButton').removeClass('btn-success');
    $('#saveButton').addClass('btn-warning');
    $('#saveButton').prop('id', 'editButton');
    $('#myModal').modal('show');
});

$(document).on('click', '#editButton', function () {
    Manager.EditAllocateClassRoom(_id);
});

$(document).on('click', '.deleteIcon', function () {
    _id = dTable.row($(this).parents('tr')).data().Id;
    Manager.DeleteAllocateClassRoom(_id);
});

//$(document).on('click', '.editIcon', function () {
//    var rowData = dTable.row($(this).parents()).data();
//    $('#departmentDDL').val(rowData.DepartmentId);
//    $('#courseDDL').val(rowData.CourseId);
//    $('#roomNoDDL').val(rowData.RoomNoId);
//    $('#dayDDL').val(rowData.DayId);
//    $('#startTime').val(rowData.StartTime);
//    $('#endTime').val(rowData.EndTime);
//    _id = rowData.Id;
//});

//$(document).on('click', '.deleteIcon', function () {
//    _id = dTable.row($(this).parents('tr')).data().Id;
//    Manager.DeleteAllocateClassRoom(_id);
//});