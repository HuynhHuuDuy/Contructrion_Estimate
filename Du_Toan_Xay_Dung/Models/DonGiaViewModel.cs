using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Du_Toan_Xay_Dung.Models
{
    public class DonGiaViewModel
    {
        public DonGiaViewModel() { }

        public DonGiaViewModel(UnitPrice obj) 
        {
            ID = obj.ID;
            Name = obj.Name;
            Unit = obj.Unit;
        }
        public string ID { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }

    }
}