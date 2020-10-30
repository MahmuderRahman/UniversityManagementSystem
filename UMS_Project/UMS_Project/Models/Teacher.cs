using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace UMS_Project.Models
{
    [Table("Teachers")]
    public class Teacher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string ContactNo { get; set; }
        public int DesignationId { get; set; }
        public int DepartmentId { get; set; }
        public decimal TotalCredit { get; set; }


        public decimal GetRemainingCredit(int teacherId)
        {
            using (var dbContext = new ProjectContext())
            {
                decimal ct = (from crsT in dbContext.CourseTeachers
                              join crs in dbContext.Courses on crsT.CourseId equals crs.Id
                              join dpt in dbContext.Departments on crsT.DepartmentId equals dpt.Id
                              where crsT.TeacherId == teacherId
                              select crs.Credit).DefaultIfEmpty(0).Sum();

                decimal totalCredit = dbContext.Teachers.Find(teacherId).TotalCredit;
                decimal remainingCredit = (totalCredit - ct);

                return remainingCredit;
            }
        }

    }
}