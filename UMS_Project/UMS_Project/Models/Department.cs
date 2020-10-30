using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace UMS_Project.Models
{
    [Table("Departments")]
    public class Department
    {
        public int Id { get; set; }     
        public string Name { get; set; }
        public string Code { get; set; }
    }
}