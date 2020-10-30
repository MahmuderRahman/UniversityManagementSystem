using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace UMS_Project.Models
{
    [Table("EnrollCourses")]
    public class EnrollCourse
    {
        public int Id { get; set; }
        public int RegNoId { get; set; }
        public int CourseId { get; set; }
        public DateTime Date { get; set; }
    }
}