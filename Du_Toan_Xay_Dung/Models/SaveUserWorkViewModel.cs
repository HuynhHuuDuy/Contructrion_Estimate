using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Du_Toan_Xay_Dung.Models
{
    public class SaveUserWorkViewModel
    {
        public long BuildingItem_ID { get; set; }
        public long Sub_BuildingItem_ID { get; set; }
        public long IndexSheet { get; set; }
        public string ID { get; set; }
        public string NormWork_ID { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public string Number { get; set; }
        public string Horizontal { get; set; }
        public string Vertical { get; set; }
        public string Height { get; set; }
        public string Area { get; set; }
        public string PriceMaterial { get; set; }
        public string PriceLabor { get; set; }
        public string PriceMachine { get; set; }
    }
}