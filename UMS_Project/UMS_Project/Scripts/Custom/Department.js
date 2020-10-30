var _id = null;
var dTable = null;
$(document).ready(function () {

    Manager.GetDataForTable(0);

    //$("#editButton").click(function () {
    //    Manager.EditDepartment(_id);
    //});

    //$("#clearButton").click(function () {
    //    Manager.ResetForm(_id);
    //});

});

var Manager = {
    ResetForm: function () {
        _id = null;
        $('#departmentForm')[0].reset();
    },
    SaveDepartment: function () {

        if (!$('#nameText').val()) {
            Message.Warning("Name is required");
        }

        else if (!$('#codeText').val()) {
            Message.Warning("Code is required");
        }

        else if (Message.Prompt()) {
            var jsonParam = $('#departmentForm').serialize();
            var serviceURL = "/Department/SaveDepartment/";
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

    EditDepartment: function (id) {

        if (!$('#nameText').val()) {
            Message.Warning("Name is required");
        }
        else if (!$('#codeText').val()) {
            Message.Warning("Code is required");
        }
        else if (Message.Prompt()) {
            var jsonParam = $('#departmentForm').serialize() + '&Id=' + id;
            var serviceURL = "/Department/EditDepartment/";
            AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);

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

    DeleteDepartment: function (id) {
        if (confirm('Are you sure that you want to do it?')) {
            //else if (Message.Prompt()) {
                var jsonParam = { departmentId: id };
                var serviceURL = "/Department/DeleteDepartment/";
                AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
            //}
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
        var serviceURL = "/Department/GetDepartments/";
        AjaxManager.SendJsonAsyncON(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            console.log('OK');
            Manager.LoadDataTable(jsonData, refresh);
        }

        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    LoadDataTable: function (data, refresh) {
        if (refresh == "0") {
            dTable = $('#tableElement').DataTable({
                dom: 'lB<"toolbar">frtip',
                buttons: [
                    {
                        extend: 'csvHtml5',
                        exportOptions: {
                            columns: [0, 1, 2]
                        },
                        title: 'Department'
                    }, 'print', 'pdfHtml5'
                ],

                scrollY: "300px",
                scrollX: true,
                scrollCollapse: true,
                lengthMenu: [[10, 15, 20], [10, 15, 20, "All"]],
                columnDefs: [
                    { visible: false, targets: [] },
                    { className: "dt-center", targets: [0, 1, 2] }
                ],
                columns: [
                {
                    data: 'Name',
                    name: 'Name',
                    title: 'Name',
                    width: 100
                },
                {
                    data: 'Code',
                    name: 'Code',
                    title: 'Code',
                    width: 100,
                },

                    {
                        name: 'Option',
                        title: 'Option',
                        width: 30,

                        render: function (cellValue, type, row) {

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
    Manager.SaveDepartment();
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
    _id = rowData.Id;

    $('#saveButton').text('Update');
    $('#saveButton').removeClass('btn-success');
    $('#saveButton').addClass('btn-warning');
    $('#saveButton').prop('id', 'editButton');
    $('#myModal').modal('show');
});

$(document).on('click', '#editButton', function () {
    Manager.EditDepartment(_id);
});

$(document).on('click', '.deleteIcon', function () {
    _id = dTable.row($(this).parents('tr')).data().Id;
    Manager.DeleteDepartment(_id);
});

//$(document).on('click', '.editIcon', function () {
//    var rowData = dTable.row($(this).parents('tr')).data();
//    $('#nameText').val(rowData.Name);
//    $('#codeTxt').val(rowData.Code);
//    _id = rowData.Id;
//});

//$(document).on('click', '.deleteIcon', function () {
//    _id = dTable.row($(this).parents('tr')).data().Id;
//    Manager.DeleteDepartment(_id);
//});