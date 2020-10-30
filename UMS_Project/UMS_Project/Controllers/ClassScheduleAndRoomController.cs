using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UMS_Project.Models;

namespace UMS_Project.Controllers
{
    public class ClassScheduleAndRoomController : Controller
    {
        ProjectContext dbContext = new ProjectContext();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetDepartmentInfo()
        {
            var list = (from dpt in dbContext.Departments
                        select new
                        {
                            dpt.Id,
                            dpt.Name

                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetClassScheduleAndRoomInfoByDepartment(int departmentId)
        {
            var list = (from clsRm in dbContext.AllocateClassRooms.AsEnumerable()
                        join crs in dbContext.Courses on clsRm.CourseId equals crs.Id
                        join rmNo in dbContext.RoomNumbers on clsRm.RoomNoId equals rmNo.Id



                        where clsRm.DepartmentId == departmentId
                        select new
                        {
                            CourseCode = crs.Code,
                            CourseName = crs.Name,
                            clsRm.RoomNoId,
                            RoomNumber = rmNo.Name,

                            //StartTime=clsRm.StartTime.Hours+':'+clsRm.StartTime.Minutes,
                            StartTime = clsRm.StartTime,
                            EndTime = clsRm.EndTime
                        }).ToList();

            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}