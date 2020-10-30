using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using UMS_Project.Models;

namespace UMS_Project.Controllers
{
    public class CourseController : Controller
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

        public ActionResult GetSemesterInfo()
        {
            var data = (from sem in dbContext.Semesters
                        select new
                        {
                            sem.Id,
                            sem.Name
                        }).ToList();
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCourses()
        {
            var dataList = (from crs in dbContext.Courses
                            join dpt in dbContext.Departments on crs.DepartmentId equals dpt.Id
                            join sem in dbContext.Semesters on crs.SemesterId equals sem.Id
                            select new
                            {
                                crs.Id,
                                crs.Code,
                                crs.Name,
                                crs.Credit,
                                crs.Description,
                                crs.DepartmentId,
                                DepartmentName = dpt.Name,
                                crs.SemesterId,
                                SemesterName = sem.Name
                            }).ToList();

            return Json(dataList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveCourse(Course course)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);

            try
            {
                using (dbContext = new ProjectContext())
                {         
                    if (course.Code.Length < 5)
                        throw new Exception("Code must be at least five (5) characters long.");
               
                    if (dbContext.Courses.Any(c => c.Code == course.Code))
                        throw new Exception("Code already exists! Try new one");

                    if (dbContext.Courses.Any(c => c.Name == course.Name))
                        throw new Exception("Name already exists! Try new one");
                    dbContext.Courses.Add(course);
                    int rowAff = dbContext.SaveChanges();
                    rtn = Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception exception)
            {
                rtn = Json(exception.Message, JsonRequestBehavior.DenyGet);
            }
            return rtn;
        }

        public ActionResult EditCourse(Course course)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    if (course.Code.Length <5)
                        throw new Exception("Code must be at least five (5) characters long.");
                    dbContext.Entry(course).State = EntityState.Modified;
                    int rowAff = dbContext.SaveChanges();
                    return Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception exception)
            {

                rtn = Json(exception.Message, JsonRequestBehavior.DenyGet);
            }
            return rtn;
        }

        public ActionResult DeleteCourse(int courseId)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    Course course = new Course { Id = courseId };
                    dbContext.Entry(course).State = EntityState.Deleted;
                    int rowAff = dbContext.SaveChanges();
                    rtn = Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception exception)
            {
                rtn = Json(0, JsonRequestBehavior.DenyGet);
            }
            return rtn;
        }
    }
}