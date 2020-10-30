var _id = null;
var dTable = null;
$(document).ready(function () {
    Manager.GetDataForTable(0);

    Manager.LoadDepartmentDDL();

});

var Manager = {
    ResetForm: function () {
        _id = null;
        $('#registerStudentForm')[0].reset();
    },

    LoadDepartmentDDL: function() {
        var serviceUrl = '/RegisterStudent/GetDepartmentInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('departmentDDL', jsonData, "Select Department");
        }

        function onFailed() {
        }
    },

    SaveRegisterStudent: function () {
        var email = $('#emailTxt').val();
        if (_id != null) {
            Message.Warning('Data already exists! Try new one.');
        }
        else if (!Manager.ValidateEmail(email)) {
            Message.Warning('Email is not valid! Please enter valid email');
        }
        else {
            if (Message.Prompt()) {
                var jsonParam = $('#registerStudentForm').serialize();
                var serviceURL = "/RegisterStudent/SaveRegisterStudent/";
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
        }
        
    },

    EditRegisterStudent: function (id) {
        var email = $('#emailTxt').val();
        if (_id != null) {
            Message.Warning('Data already exists! Try new one.');
        }
        if (!Manager.ValidateEmail(email)) {
            Message.Warning('Email is not valid! Please enter valid email');
        }
         else {
             if (Message.Prompt()) {
                 var jsonParam = $('#registerStudentForm').serialize() + '&Id=' + id;
                 var serviceURL = "/RegisterStudent/EditRegisterStudent/";
                 AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
             }
            function onSuccess(JsonData) {
                if (JsonData =="200") {
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
        }
    },

    DeleteRegisterStudent: function (id) {
        if (confirm('Are you sure that you want to do it?')) {
            var jsonParam = { registerStudentId: id };
            var serviceURL = "/RegisterStudent/DeleteRegisterStudent/";
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

    GetDataForTable: function (refresh) {
        var jsonParam = '';
        var serviceURL = "/RegisterStudent/GetDepartments/";
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
                        data: 'Name',
                        name: 'Name',
                        title: 'Name',
                        width: 100
                    },


                      {
                          data: 'Email',
                          name: 'Email',
                          title: 'Email',
                          width: 100
                      },

                      {
                          data: 'RegNo',
                          name: 'RegNo',
                          title: 'Registration Number',
                          width: 150
                      },

                       {
                           data: 'ContactNo',
                           name: 'ContactNo',
                           title: 'ContactNo',
                           width: 50
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
                             data: 'Address',
                             name: 'Address',
                             title: 'Address',
                             width: 120
                         },

                          {
                              data: 'DepartmentName',
                              name: 'DepartmentName',
                              title: 'DepartmentName',
                              width: 120
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

        return  (day) + "-" + (monthNames[month]) + "-" + dateObject.getFullYear();
    },

    FormatDateToYearMonthDay: function (date) {
    var dateObject = new Date(date);
    var day = ("0" + dateObject.getDate()).slice(-2);
    var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);

    return  dateObject.getFullYear()+"-"+(month)+"-"+(day);
    },

    ValidateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

$(document).on('click', '#saveButton', function () {
    Manager.SaveRegisterStudent();
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
    $('#nameTxt').val(rowData.Name);
    $('#emailTxt').val(rowData.Email);
    $('#regNoTxt').val(rowData.RegNo);
    $('#contactNoTxt').val(rowData.ContactNo);
    //$('#date').val(formattedDate);
    $('#date').val(rowData.Date);
    $('#addressTxt').val(rowData.Address);
    $('#departmentDDL').val(rowData.DepartmentId);
    _id = rowData.Id;

    $('#saveButton').text('Update');
    $('#saveButton').removeClass('btn-success');
    $('#saveButton').addClass('btn-warning');
    $('#saveButton').prop('id', 'editButton');
    $('#myModal').modal('show');
});

$(document).on('click', '#editButton', function () {
    Manager.EditRegisterStudent(_id);
});

$(document).on('click', '.deleteIcon', function () {
    _id = dTable.row($(this).parents('tr')).data().Id;
    Manager.DeleteRegisterStudent(_id);
});





//$(document).on('click', '.editIcon', function () {

//    var rowData = dTable.row($(this).parents()).data();
//    var formattedDate = Manager.FormatDateToYearMonthDay(rowData.Date);
//    $('#nameTxt').val(rowData.Name);
//    $('#emailTxt').val(rowData.Email);
//    $('#regNoTxt').val(rowData.RegNo);
//    $('#contactNoTxt').val(rowData.ContactNo);
//    $('#date').val(formattedDate);
//    $('#addressTxt').val(rowData.Address);
//    $('#departmentDDL').val(rowData.DepartmentId);
//    _id = rowData.Id;
//}),

//$(document).on('click', '.deleteIcon', function () {
//    _id = dTable.row($(this).parents('tr')).data().Id;
//    Manager.DeleteRegisterStudent(_id);
//});
