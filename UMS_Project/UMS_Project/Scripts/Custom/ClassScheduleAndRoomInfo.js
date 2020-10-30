var _id = null;
var dTable = null;

$(document).ready(function () {

    Manager.LoadDepartmentDDL();

    Manager.GetDataForTable(0, 0);

    $('#departmentDDL').change(function () {
        var dptId = $(this).val();
        if (dTable == null) {
            Manager.GetDataForTable(dptId, 0);
        }
        else {
            Manager.GetDataForTable(dptId, 1);
        }

    });



});

var Manager = {


    LoadDepartmentDDL: function () {
        var serviceUrl = '/ClassScheduleAndRoom/GetDepartmentInfo/';
        var jsonParam = '';
        AjaxManager.SendJson(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('departmentDDL', jsonData, "Select Department");
        }
        function onFailed() {
        }
    },

    GetDataForTable: function (departmentId, refresh) {
        var jsonParam = { departmentId: departmentId };
        var serviceURL = "/ClassScheduleAndRoom/GetClassScheduleAndRoomInfoByDepartment/";
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
                    { className: "dt-center", targets: [0, 1, 2, 3] }
                ],
                columns: [
                    {
                        data: 'CourseCode',
                        name: 'CourseCode',
                        title: 'Course Code',
                        width: 100
                    },


                      {
                          data: 'CourseName',
                          name: 'CourseName',
                          title: 'Course Name',
                          width: 100
                      },

                       {
                           data: 'RoomNumber',
                           name: 'RoomNumber',
                           title: 'Room Number',
                           width: 100
                       },

                        {
                            data: 'StartTime',
                            name: 'StartTime',
                            title: 'Start Time',
                            width: 80,
                            render: function (data, type, row) {
                                var date = moment(data);
                                return date.format("LLL");
                            }
                        },

                {
                    data: 'EndTime',
                    name: 'EndTime',
                    title: 'End Time',
                    width: 80,
                    render: function (data, type, row) {
                        var date = moment(data);
                        return date.format("LLL");
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