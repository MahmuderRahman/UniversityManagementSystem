using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.DynamicData;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using UMS_Project.Models;

namespace UMS_Project.Controllers
{
    public class CourseTeacherController : Controller
    {
        ProjectContext dbContext = new ProjectContext();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetCourseTeachers()
        {
            var dataList = (from crsT in dbContext.CourseTeachers.AsEnumerable()
                            join dpt in dbContext.Departments on crsT.DepartmentId equals dpt.Id
                            join tcr in dbContext.Teachers on crsT.TeacherId equals tcr.Id
                            join crs in dbContext.Courses on crsT.CourseId equals crs.Id
                            select new
                            {
                                crsT.Id,
                                crsT.DepartmentId,
                                DepartmentName = dpt.Name,
                                crsT.TeacherId,
                                TeacherName = tcr.Name,
                                tcr.TotalCredit,
                                RemainingCredit = tcr.GetRemainingCredit(tcr.Id),
                                crsT.CourseId,
                                CouraseCode = crs.Code,
                                crs.Name,
                                crs.Credit
                            }).ToList();

            return Json(dataList, JsonRequestBehavior.AllowGet);
        }


        public ActionResult SaveCourseTeacher(CourseTeacher courseTeacher)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.AllowGet);
            using (dbContext)
            {
                try
                {
                    dbContext.CourseTeachers.Add(courseTeacher);
                    int rowAff = dbContext.SaveChanges();
                    rtn = Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
                catch (Exception exception)
                {

                    rtn = Json(exception.Message, JsonRequestBehavior.AllowGet);
                }
                return rtn;
            }
        }

        //public ActionResult EditCourseTeacher(CourseTeacher courseTeacher)
        //{
        //    ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
        //    try
        //    {
        //        using (dbContext)
        //        {
        //            dbContext.Entry(courseTeacher).State = EntityState.Modified;
        //            int rowAff = dbContext.SaveChanges();
        //            return Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
        //        }
        //    }
        //    catch (Exception exception)
        //    {

        //        rtn = Json(exception.Message, JsonRequestBehavior.DenyGet);
        //    }
        //    return Json(rtn, JsonRequestBehavior.AllowGet);
        //}

        public ActionResult DeleteCourseTeacher(int courseTeacherId)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    CourseTeacher courseTeacher = new CourseTeacher { Id = courseTeacherId };
                    dbContext.Entry(courseTeacher).State = EntityState.Deleted;
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

        public ActionResult GetTeacherByDepartment(int departmentId)
        {
            var list = (from tcr in dbContext.Teachers
                        where tcr.DepartmentId == departmentId
                        select new
                        {
                            tcr.Id,
                            tcr.Name
                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //public ActionResult GetCourseCodeInfo()
        //{
        //    var list = (from crs in dbContext.Courses
        //                select new
        //                {
        //                    crs.Id,
        //                    Name = crs.Code
        //                }).ToList();
        //    return Json(list, JsonRequestBehavior.AllowGet);
        //}

        public ActionResult GetCourseByDepartment(int courseId)
        {
            var list = (from crs in dbContext.Courses
                        where crs.DepartmentId == courseId
                        select new
                        {
                            crs.Id,
                            crs.Name,
                            crs.Credit
                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTeacherCreditInfo(int teacherId)
        {
            decimal totalCredit = dbContext.Teachers.Find(teacherId).TotalCredit;

            decimal ct = (from crsT in dbContext.CourseTeachers
                          join crs in dbContext.Courses on crsT.CourseId equals crs.Id
                          join dpt in dbContext.Departments on crsT.DepartmentId equals dpt.Id
                          where crsT.TeacherId == teacherId
                          select crs.Credit).DefaultIfEmpty(0).Sum();

            decimal remainingCredit = (totalCredit - ct);
            var data = new { totalCredit, remainingCredit };

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCourseInfoByCode(int code)
        {
            var dataList = (from crsT in dbContext.CourseTeachers
                            join crs in dbContext.Courses on crsT.CourseId equals crs.Id
                            where crsT.CourseId == code
                            select new
                            {
                                crsT.Id,
                                crs.Name,
                                crs.Credit
                            }).ToList().FirstOrDefault();
            return Json(dataList, JsonRequestBehavior.AllowGet);
        }
    }
}