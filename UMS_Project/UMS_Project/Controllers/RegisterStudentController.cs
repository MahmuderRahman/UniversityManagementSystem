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
    public class RegisterStudentController : Controller
    {
        ProjectContext dbContext = new ProjectContext();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetDepartments()
        {
            var dataList = (from RegS in dbContext.RegisterStudents.AsEnumerable()
                            join dpt in dbContext.Departments on RegS.DepartmentId equals dpt.Id
                            select new
                            {
                                RegS.Id,
                                RegS.Name,
                                RegS.RegNo,
                                RegS.Email,
                                RegS.ContactNo,
                                Date =RegS.Date.ToJavaScriptMilliseconds(),
                                RegS.Address,
                                RegS.DepartmentId,
                                DepartmentName = dpt.Name
                            }).ToList();

            return Json(dataList, JsonRequestBehavior.AllowGet);
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

        public ActionResult SaveRegisterStudent(RegisterStudent registerStudent)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext)
                {
                    if (dbContext.RegisterStudents.Any(e => e.Email == registerStudent.Email))
                        throw new Exception("Email already exists! Try new one");
                    dbContext.RegisterStudents.Add(registerStudent);
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

        public ActionResult EditRegisterStudent(RegisterStudent registerStudent)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    dbContext.Entry(registerStudent).State = EntityState.Modified;
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

        public ActionResult DeleteRegisterStudent(int registerStudentId)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    RegisterStudent registerStudent= new RegisterStudent { Id = registerStudentId };
                    dbContext.Entry(registerStudent).State = EntityState.Deleted;
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