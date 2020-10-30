using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.Reporting.WebForms;
using UMS_Project.Report.DataSet.StudentCourseInfoTableAdapters;

namespace UMS_Project.Report.Viewer
{
    public partial class StudentCourseInfo : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                spGetStudentAndCourseInfoTableAdapter tableAdapter=new spGetStudentAndCourseInfoTableAdapter();
                DataTable table = tableAdapter.GetData();
                ReportViewer1.LocalReport.ReportPath = "Report/Designer/StudentCourseInfo.rdlc";
                ReportViewer1.LocalReport.DataSources.Clear();
                ReportDataSource dataSource=new ReportDataSource("StudentCourseInfo",table);
                ReportViewer1.LocalReport.DataSources.Add(dataSource);
                ReportViewer1.LocalReport.Refresh();
            }
        }
    }
}