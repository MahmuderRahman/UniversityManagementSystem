using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace UMS_Project.Models
{
    [Table("GradeLetters")]
    public class GradeLetter
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}