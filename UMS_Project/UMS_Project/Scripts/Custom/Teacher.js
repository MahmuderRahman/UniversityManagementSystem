var _id = null;
var dTable = null;
$(document).ready(function () {

    Manager.GetDataForTable(0);

    Manager.LoadDesignationDDL();

    Manager.LoadDepartmentDDL();
});

var Manager = {

    ResetForm: function () {
        $('#teacherForm')[0].reset();
    },

    SaveTeacher: function () {

        if (!$('#nameText').val()) {
            Message.Warning("Name is required");
        }

        else if ($('#totalCreditText').val() < 1 || $('#totalCreditText').val() > 20) {
            Message.Warning(" Credit to be taken field must contain a non-negative value.");
        }

        else {

            var email = $('#emailText').val();
            if (_id != null) {
                Message.Warning('Email already exists.');
            }
            else if (!Manager.ValidateEmail(email)) {
                Message.Warning('Email is not valid.');
            }

            else {
                var phone = $('#contactNoText').val();
                if (_id != null) {
                    Message.Warning('ContactNo already exists.');
                }
                if (!Manager.ValidatePhone(phone)) {
                    Message.Warning('ContactNo is not valid.');
                }
                else if (Message.Prompt()) {
                    var jsonParam = $('#teacherForm').serialize();
                    var serviceURL = "/Teacher/SaveTeacher/";
                    AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
                }
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
        }
    },

    EditTeacher: function (id) {

        if (!$('#nameText').val()) {
            Message.Warning("Name is required");
        }
        else if ($('#totalCreditText').val() < 1 || $('#totalCreditText').val() > 20) {
            Message.Warning(" Credit to be taken field must contain a non-negative value.");
        }
        else {
            var email = $('#emailText').val();
            if (!Manager.ValidateEmail(email)) {
                Message.Warning('Email is not valid.');
            }
            else {
                var phone = $('#contactNoText').val();
                if (!Manager.ValidatePhone(phone)) {
                    Message.Warning('ContactNo is not valid.');
                }

                else if (Message.Prompt()) {
                    var jsonParam = $('#teacherForm').serialize() + '&Id=' + id;
                    var serviceURL = "/Teacher/EditTeacher/";
                    AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
                }
            }
            function onSuccess(JsonData) {
                if (JsonData == "200") {
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

    DeleteTeacher: function (id) {
        if (confirm('Are you sure that you want to do it?')) {
            var jsonParam = { teacherId: id };
            var serviceURL = "/Teacher/DeleteTeacher/";
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

    LoadDesignationDDL: function () {
        var serviceUrl = '/Teacher/GetDesignationInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('designationDDL', jsonData, "Select Designation");
        }

        function onFailed() {
        }
    },

    LoadDepartmentDDL: function () {
        var serviceUrl = '/Teacher/GetDepartmentInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            AjaxManager.populateCombo('departmentDDL', jsonData, "Select Department");
        }

        function onFailed() {
        }
    },

    GetDataForTable: function (refresh) {
        var jsonParam = '';
        var serviceURL = "/Teacher/GetTeachers/";
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
                    { className: "dt-center", targets: [0, 1, 2, 3, 4, 5, 6, 7] }
                ],
                columns: [
                    {
                        data: 'Name',
                        name: 'Name',
                        title: 'Name',
                        width: 100
                    },

                    {
                        data: 'Address',
                        name: 'Address',
                        title: 'Address',
                        width: 100
                    },

                    {
                        data: 'Email',
                        name: 'Email',
                        title: 'Email',
                        width: 100
                    },

                    {
                        data: 'ContactNo',
                        name: 'ContactNo',
                        title: 'Contact No',
                        width: 100
                    },

                    {
                        data: 'Designation',
                        name: 'Designation',
                        title: 'Designation',
                        width: 100
                    },

                    {
                        data: 'Department',
                        name: 'Department',
                        title: 'Department',
                        width: 70
                    },

                    {
                        data: 'TotalCredit',
                        name: 'TotalCredit',
                        title: 'Total Credit',
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
    ValidateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    ValidatePhone: function validatePhone(field, alerttext) {
        if (field.match(/^\d{11}/)) {
            return true;
        }
        return false;
    }
}

$(document).on('click', '#saveButton', function () {
    Manager.SaveTeacher();
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
    $('#nameText').val(rowData.Name);
    $('#addressText').val(rowData.Address);
    $('#emailText').val(rowData.Email);
    $('#contactNoText').val(rowData.ContactNo);
    $('#designationDDL').val(rowData.DesignationId);
    $('#departmentDDL').val(rowData.DepartmentId);
    $('#totalCreditText').val(rowData.TotalCredit);
    _id = rowData.Id;

    $('#saveButton').text('Update');
    $('#saveButton').removeClass('btn-success');
    $('#saveButton').addClass('btn-warning');
    $('#saveButton').prop('id', 'editButton');
    $('#myModal').modal('show');
});

$(document).on('click', '#editButton', function () {
    Manager.EditTeacher(_id);
});

$(document).on('click', '.deleteIcon', function () {
    _id = dTable.row($(this).parents('tr')).data().Id;
    Manager.DeleteTeacher(_id);
});

//$(document).on('click', '.editIcon', function () {
//    var rowData = dTable.row($(this).parents('tr')).data();
//    $('#nameTxt').val(rowData.Name);
//    $('#addressTxt').val(rowData.Address);
//    $('#emailTxt').val(rowData.Email);
//    $('#contactNoTxt').val(rowData.ContactNo);
//    $('#designationDDL').val(rowData.DesignationId);
//    $('#departmentDDL').val(rowData.DepartmentId);
//    $('#totalCreditTxt').val(rowData.TotalCredit);
//    _id = rowData.Id;
//});

//$(document).on('click', '.deleteIcon', function () {
//    _id = dTable.row($(this).parents('tr')).data().Id;
//    Manager.DeleteTeacher(_id);
//});

