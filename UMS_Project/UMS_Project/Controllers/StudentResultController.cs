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
    public class StudentResultController : Controller
    {
        ProjectContext dbContext=new ProjectContext();

        public ActionResult SaveStudentResult(StudentResult studentResult)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);

            try
            {
                using (dbContext = new ProjectContext())
                {
                    dbContext.StudentResults.Add(studentResult);
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

        public ActionResult EditStudentResult(StudentResult studentResult)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            using (dbContext)
            {
                try
                {
                    dbContext.Entry(studentResult).State=EntityState.Modified;
                    int rowAff = dbContext.SaveChanges();
                    return Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
                catch (Exception exception)
                {
                    
                   rtn=Json(exception.Message,JsonRequestBehavior.DenyGet);
                }
                return Json(rtn,JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DeleteStudentResult(int studentResultId)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    StudentResult studentResult = new StudentResult { Id = studentResultId };
                    dbContext.Entry(studentResult).State = EntityState.Deleted;
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

        public ActionResult StudentResult()
        {
            return View();
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

        public ActionResult GetGradeLetterInfo()
        {
            var data = (from grdLtr in dbContext.GradeLetters
                        select new
                        {
                            grdLtr.Id,
                            grdLtr.Name
                        }).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetStudentResultInfo()
        {
            var data = (from stdR in dbContext.StudentResults
                        join regStd in dbContext.RegisterStudents on stdR.RegNoId equals regStd.Id
                        join dpt in dbContext.Departments on regStd.DepartmentId equals dpt.Id
                        join crs in dbContext.Courses on stdR.CourseId equals crs.Id
                        join grdLtr in dbContext.GradeLetters on stdR.GradeLetterId equals grdLtr.Id
                        select new
                        {
                            stdR.Id,
                            stdR.RegNoId,
                            RegistrationNumber = regStd.RegNo,
                            StudentName=regStd.Name,
                            regStd.Email,
                            regStd.DepartmentId,
                            DepartmentName = dpt.Name,
                            stdR.CourseId,
                            CourseName = crs.Name,
                            stdR.GradeLetterId,
                            GradeLetter = grdLtr.Name
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
                        }).ToList().FirstOrDefault();

            return Json(data, JsonRequestBehavior.AllowGet);
        }
	}
}