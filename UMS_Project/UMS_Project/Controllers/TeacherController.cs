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
    public class TeacherController : Controller
    {
        ProjectContext dbContext = new ProjectContext();
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult GetDesignationInfo()
        {
            var list = (from deg in dbContext.Designations
                        select new
                        {
                            deg.Id,
                            deg.Name
                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
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

        public ActionResult GetTeachers()
        {
            var dataList = (from tcr in dbContext.Teachers
                join deg in dbContext.Designations on tcr.DesignationId equals deg.Id
                join dpt in dbContext.Departments on tcr.DepartmentId equals dpt.Id
                select new
                {
                    tcr.Id,
                    tcr.Name,
                    tcr.Address,
                    tcr.Email,
                    tcr.ContactNo,
                    tcr.DesignationId,
                    Designation=deg.Name,
                    tcr.DepartmentId,
                    Department=dpt.Name,
                    tcr.TotalCredit
                }).ToList();
            
            return Json(dataList,JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveTeacher(Teacher teacher)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    if (dbContext.Teachers.Any(e => e.Email == teacher.Email))
                        throw new Exception("Email already exists! Try new one");
                    if (dbContext.Teachers.Any(e => e.ContactNo == teacher.ContactNo))
                        throw new Exception("ContactNo already exists! Try new one");
                    dbContext.Teachers.Add(teacher);
                    int rowAff = dbContext.SaveChanges();
                    return Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception exception)
            {
                rtn = Json(exception.Message, JsonRequestBehavior.AllowGet);
            }
            return rtn;
        }

        public ActionResult EditTeacher(Teacher teacher)
        {

            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    dbContext.Entry(teacher).State = EntityState.Modified;
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

        public ActionResult DeleteTeacher(int teacherId)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    Teacher teacher = new Teacher{ Id = teacherId };
                    dbContext.Entry(teacher).State = EntityState.Deleted;
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