using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace UMS_Project.Models
{
    [Table("StudentResults")]
    public class StudentResult
    {
        public int Id { get; set; }
        public int RegNoId { get; set; }
        public int CourseId { get; set; }
        public int GradeLetterId { get; set; }
    }
}