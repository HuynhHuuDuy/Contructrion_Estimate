using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Du_Toan_Xay_Dung.Models;

namespace Du_Toan_Xay_Dung.Models
{
    public class User_NormWorkViewModel
    {
        public User_NormWorkViewModel() { }

        public User_NormWorkViewModel(User_NormWork obj)
        {
            NormWork_ID = obj.NormWork_ID;
            Email = obj.Email;
            Name = obj.Name;
            Unit = obj.Unit;
        }

        public string NormWork_ID { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public List<User_NormDetailViewModel> Norm_Details { get; set; }

    }
}