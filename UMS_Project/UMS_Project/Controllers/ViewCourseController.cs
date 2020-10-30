using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using UMS_Project.Models;

namespace UMS_Project.Controllers
{
    public class ViewCourseController : Controller
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

        public ActionResult GetCourseInfoByDepartment(int departmentId)
        {
            var list = (from ct in dbContext.CourseTeachers
                        join crs in dbContext.Courses on ct.CourseId equals crs.Id
                        join tcr in dbContext.Teachers on ct.TeacherId equals tcr.Id
                        join sem in dbContext.Semesters on crs.SemesterId equals sem.Id
                        where crs.DepartmentId == departmentId
                        select new
                        {
                            crs.Code,
                            CourseName = crs.Name,
                            SemesterName = sem.Name,
                            TeacherName = tcr.Name
                        }).ToList();

            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}