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
        var serviceUrl = '/ViewCourse/GetDepartmentInfo/';
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
        var serviceURL = "/ViewCourse/GetCourseInfoByDepartment/";
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
                        data: 'Code',
                        name: 'Code',
                        title: 'Code',
                        width: 100
                    },


                      {
                          data: 'CourseName',
                          name: 'CourseName',
                          title: 'Course Name',
                          width: 100
                      },

                       {
                           data: 'SemesterName',
                           name: 'SemesterName',
                           title: 'Semester Name',
                           width: 100
                       },

                        {
                            data: 'TeacherName',
                            name: 'TeacherName',
                            title: 'Teacher Name',
                            width: 100
                        }
                ],
                data: data
            });
        } else {
            dTable.clear().rows.add(data).draw();
        }
    }
}