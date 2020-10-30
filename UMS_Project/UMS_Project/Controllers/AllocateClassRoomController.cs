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
    public class AllocateClassRoomController : Controller
    {
        ProjectContext dbContext = new ProjectContext();

        public ActionResult AllocateClassRoom()
        {
            return View();
        }

        public ActionResult SaveAllocateClassRoom(AllocateClassRoom allocateClassRoom)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);

            try
            {
                using (dbContext = new ProjectContext())
                {
                    dbContext.AllocateClassRooms.Add(allocateClassRoom);
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

        public ActionResult EditAllocateClassRoom(AllocateClassRoom allocateClassRoom)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.DenyGet);
            try
            {
                using (dbContext)
                {
                    dbContext.Entry(allocateClassRoom).State=EntityState.Modified;
                    int rowAff = dbContext.SaveChanges();
                    return Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception exception)
            {
                
                rtn=Json(exception.Message,JsonRequestBehavior.DenyGet);
            }
            return Json(rtn,JsonRequestBehavior.AllowGet);
        }

        public ActionResult DeleteAllocateClassRoom(int allocateClsRmId)
        {
            ActionResult rtn = Json(0, JsonRequestBehavior.AllowGet);
            try
            {
                using (dbContext)
                {
                    AllocateClassRoom allocateClassRoom = new AllocateClassRoom {Id = allocateClsRmId};
                    dbContext.Entry(allocateClassRoom).State=EntityState.Deleted;
                    int rowAff = dbContext.SaveChanges();
                    return Json(HttpStatusCode.OK, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception exception)
            {

                rtn = Json(0, JsonRequestBehavior.AllowGet);
            }
            return Json(rtn,JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetAllocateClassRoomInfo()
        {
            var dataList = (from clsRoom in dbContext.AllocateClassRooms.AsEnumerable()
                            join dpt in dbContext.Departments on clsRoom.DepartmentId equals dpt.Id
                            join crs in dbContext.Courses on clsRoom.CourseId equals crs.Id
                            join roomNo in dbContext.RoomNumbers on clsRoom.RoomNoId equals roomNo.Id
                            join day in dbContext.Days on clsRoom.DayId equals day.Id
                            select new
                            {
                                clsRoom.Id,
                                clsRoom.DepartmentId,
                                DepartmentName = dpt.Name,
                                clsRoom.CourseId,
                                CourseName = crs.Name,
                                clsRoom.RoomNoId,
                                RoomNumber = roomNo.Name,
                                clsRoom.DayId,
                                DayName = day.Name,
                                //Type=>timespan er jonno
                                //StartTime = clsRoom.StartTime.Hours + ":" + clsRoom.StartTime.Minutes,
                                //EndTime = clsRoom.EndTime.Hours + ":" + clsRoom.EndTime.Minutes
                                StartTime = clsRoom.StartTime,
                                EndTime = clsRoom.EndTime
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

        public ActionResult GetCourseInfo()
        {
            var list = (from crs in dbContext.Courses
                        select new
                        {
                            crs.Id,
                            crs.Name

                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetRoomNoInfo()
        {
            var list = (from roomNo in dbContext.RoomNumbers
                        select new
                        {
                            roomNo.Id,
                            roomNo.Name

                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetDayInfo()
        {
            var list = (from day in dbContext.Days
                        select new
                        {
                            day.Id,
                            day.Name

                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}