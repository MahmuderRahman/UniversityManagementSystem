using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using UMS_Project.Models;
using ViewResult = UMS_Project.Models.ViewResult;

namespace UMS_Project.Controllers
{
    public class ViewResultController : Controller
    {
        ProjectContext dbContext=new ProjectContext();

        public ActionResult ViewResult()
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