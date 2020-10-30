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
    public class DepartmentController : Controller
    {
        ProjectContext dbContext = new ProjectContext();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetDepartments()
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);

            try
            {
                using (dbContext = new ProjectContext())
                {
                    var data = (from dpt in dbContext.Departments
                                select new
                                {
                                    dpt.Id,
                                    dpt.Name,
                                    dpt.Code
                                }).ToList();
                    rtn = Json(data, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception exception)
            {

                rtn = Json(0, JsonRequestBehavior.DenyGet);
            }
            return rtn;
        }

        public ActionResult SaveDepartment(Department department)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);

            try
            {
                using (dbContext = new ProjectContext())
                {

                    if (department.Code.Length < 2 || department.Code.Length > 7)
                        throw new Exception(" code must be 2-7 characters long.");

                    if (dbContext.Departments.Any(d => d.Name == department.Name))
                        throw new Exception("Name already exists! Try new one");

                    if (dbContext.Departments.Any(d => d.Code == department.Code))
                        throw new Exception("Code already exists! Try new one");

                    dbContext.Departments.Add(department);
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

        public ActionResult EditDepartment(Department department)
        {

            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    if (department.Code.Length < 2 || department.Code.Length > 7)
                        throw new Exception(" code must be 2-7 characters long.");

                    dbContext.Entry(department).State = EntityState.Modified;
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

        public ActionResult DeleteDepartment(int departmentId)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext = new ProjectContext())
                {
                    Department department = new Department() { Id = departmentId };
                    dbContext.Entry(department).State = EntityState.Deleted;
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
    }
}