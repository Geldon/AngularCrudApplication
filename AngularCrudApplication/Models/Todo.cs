using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AngularCrudApplication.Models
{
    public class Todo
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime? DueDate { get; set; }
        public byte Priority { get; set; }
    }
}