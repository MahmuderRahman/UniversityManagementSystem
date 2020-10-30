using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace UMS_Project.Models
{
    [Table("ViewResults")]
    public class ViewResult
    {
        public int Id { get; set; }
        public int RegNoId { get; set; }
    }
}