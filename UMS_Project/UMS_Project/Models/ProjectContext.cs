using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using UMS_Project.Controllers;

namespace UMS_Project.Models
{
    public class ProjectContext:DbContext
    {
        public ProjectContext():base("DBCS")
        {
            
        }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Designation> Designations { get; set; }
        public DbSet<CourseTeacher> CourseTeachers { get; set; }
        public DbSet<ViewCourse> ViewCourses { get; set; }
        public DbSet<RegisterStudent> RegisterStudents { get; set; }
        public DbSet<AllocateClassRoom> AllocateClassRooms { get; set; }
        public DbSet<RoomNumber> RoomNumbers { get; set; }
        public DbSet<Day> Days { get; set; }
        public DbSet<ClassScheduleAndRoomInfo> ClassScheduleAndRoomInfos { get; set; }
        public DbSet<EnrollCourse> EnrollCorses { get; set; }
        public DbSet<StudentResult> StudentResults { get; set; }
        public DbSet<GradeLetter> GradeLetters { get; set; }
        public DbSet<ViewResult> ViewResults { get; set; }
    }
}