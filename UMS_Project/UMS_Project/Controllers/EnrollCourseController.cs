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
    public class EnrollCourseController : Controller
    {
        ProjectContext dbContext = new ProjectContext();
        public ActionResult EnrollCourse()
        {
            return View();
        }

        public ActionResult SaveEnrollCourse(EnrollCourse enrollCourse)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext)
                {
                    dbContext.EnrollCorses.Add(enrollCourse);
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

        public ActionResult EditEnrollCourse(EnrollCourse enrollCourse)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    dbContext.Entry(enrollCourse).State = EntityState.Modified;
                    int rowAff = dbContext.SaveChanges();
                    return Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception exception)
            {

                rtn = Json(exception.Message, JsonRequestBehavior.DenyGet);
            }
            return Json(rtn, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DeleteEnrollCourse(int enrollCourseId)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext)
                {
                    EnrollCourse enrollCourse = new EnrollCourse { Id = enrollCourseId };
                    dbContext.Entry(enrollCourse).State = EntityState.Deleted;
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

        public ActionResult GetEnrollCourseInfo()
        {
            var data = (from enrlCrs in dbContext.EnrollCorses.AsEnumerable()
                        join stdReg in dbContext.RegisterStudents on enrlCrs.RegNoId equals stdReg.Id
                        join dpt in dbContext.Departments on stdReg.DepartmentId equals dpt.Id
                        join crs in dbContext.Courses on enrlCrs.CourseId equals crs.Id
                        select new
                        {
                            enrlCrs.Id,
                            enrlCrs.RegNoId,
                            RegistrationNumber=stdReg.RegNo,
                            StudentName = stdReg.Name,
                            stdReg.Email,
                            stdReg.DepartmentId,
                            DepartmentName = dpt.Name,
                            enrlCrs.CourseId,
                            CourseName = crs.Name,                            
                            Date = enrlCrs.Date.ToJavaScriptMilliseconds()
                        }).ToList();
            //var result = data.Select(p => new
            //{
            //    p.Id,
            //    p.RegNoId,
            //    p.RegistrationNumber,
            //    p.StudentName,
            //    p.Email,
            //    p.DepartmentName,
            //    p.CourseId,
            //    p.CourseName,
            //    Date=p.Date.ToString("dd-MMM-yyyy")
            //}).ToList();

            //return Json(data, JsonRequestBehavior.AllowGet);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetRegistrationNoInfo()
        {
            var data = (from regNo in dbContext.RegisterStudents
                        select new
                        {
                            regNo.Id,
                            Name = regNo.RegNo
                        }).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCourseInfo()
        {
            var data = (from crs in dbContext.Courses
                        select new
                        {
                            crs.Id,
                            crs.Name
                        }).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetRegisterStudentByRegNoInfo(int RegNo)
        {
            var data = (from regStd in dbContext.RegisterStudents
                        join dpt in dbContext.Departments on regStd.DepartmentId equals dpt.Id
                        where regStd.Id == RegNo

                        select new
                        {
                            regStd.Name,
                            regStd.Email,
                            regStd.DepartmentId,
                            DepartmentName = dpt.Name
                        }).ToList().FirstOrDefault(); ;
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}