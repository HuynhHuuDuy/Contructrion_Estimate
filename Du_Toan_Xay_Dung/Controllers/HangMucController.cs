using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Du_Toan_Xay_Dung.Models;
using Du_Toan_Xay_Dung.Handlers;
using Du_Toan_Xay_Dung.Filter;
using System.Data;
using System.Data.OleDb;
using System.Xml;
using System.Globalization;

namespace Du_Toan_Xay_Dung.Controllers
{
    public class HangMucController : Controller
    {
        public DataDTXDDataContext _db = new DataDTXDDataContext();


        [PageLogin]
        public ActionResult Estimate_Work()
        {

            return View();
        }
        //....
        public JsonResult get_Buildings()
        {
            var list = _db.Buildings.Where(i => i.Email.Equals(SessionHandler.User.Email)).Select(i => new BuildingViewModel(i)).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_BuildingItems(string id)
        {
            var list = _db.BuildingItems.Where(i => i.Building_ID.Equals(id)).Select(i => new BuildingItemViewModel(i)).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_infoBuildingItem(string id)
        {
            if (id != null)
            {
                var item = _db.Buildings.Join(_db.BuildingItems, b => b.ID, bi => bi.Building_ID, (b, bi) => new
                {
                    Building = b,
                    BuildingItem = bi
                }).Where(i => i.BuildingItem.ID.Equals(id)).Select(i => new
                {
                    BuildingName = i.Building.Name,
                    BuildingItemName = i.BuildingItem.Name,
                    Building_ID = i.Building.ID,

                }).FirstOrDefault();

                return Json(item, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("error");
            }
        }
        //get Norm work (Default by System)
        public JsonResult GetNormWorks()
        {
            var list_normwork = _db.NormWorks.Select(i => new DinhMucViewModel(i)).ToList();

            return Json(list_normwork, JsonRequestBehavior.AllowGet);
        }
        //get Norm work (created by user)
        [PageLogin]
        public JsonResult getUser_Normworks()
        {
            var list = _db.User_NormWorks.Where(i => i.Email.Equals(SessionHandler.User.Email)).Select(i => new User_NormWorkViewModel(i)).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //get NormWork resource (Default by System)
        public JsonResult GetDetailNormWork_Price(string area_id)
        {
            var list = _db.NormDetails.Join(_db.UnitPrices, nd => nd.UnitPrice_ID, up => up.ID, (nd, up) => new
            {
                NormDetails = nd,
                UnitPrices = up
            })
                .Join(_db.UnitPrice_Areas, up => up.UnitPrices.ID, upa => upa.UnitPrice_ID, (up, upa) => new
                {
                    UnitPrices = up,
                    UnitPrice_Areas = upa
                }).Where(i => i.UnitPrice_Areas.Area_ID.Equals(area_id))
                    .Select(s => new
                    {
                        Key_NormWork = s.UnitPrices.NormDetails.NormWork_ID,
                        Key_Material = s.UnitPrices.UnitPrices.ID,
                        Number = s.UnitPrices.NormDetails.Numbers,
                        Unit = s.UnitPrices.UnitPrices.Unit,
                        Name_Material = s.UnitPrices.UnitPrices.Name,
                        Price = s.UnitPrice_Areas.Price
                    }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //get User_NormWork resource (created by user)
        [PageLogin]
        public JsonResult GetDetail_UserNormWork_Price(string area_id)
        {
            var list = _db.User_NormDetails.Join(_db.UnitPrices, nd => nd.UnitPrice_ID, up => up.ID, (nd, up) => new
            {
                User_NormDetail = nd,
                UnitPrices = up
            })
                .Join(_db.UnitPrice_Areas, up => up.UnitPrices.ID, upa => upa.UnitPrice_ID, (up, upa) => new
                {
                    UnitPrices = up,
                    UnitPrice_Areas = upa
                }).Where(i => i.UnitPrice_Areas.Area_ID.Equals(area_id))
                    .Select(s => new
                    {
                        Key_NormWork = s.UnitPrices.User_NormDetail.UserNormWork_ID,
                        Key_Material = s.UnitPrices.UnitPrices.ID,
                        Number = s.UnitPrices.User_NormDetail.Number,
                        Unit = s.UnitPrices.UnitPrices.Unit,
                        Name_Material = s.UnitPrices.UnitPrices.Name,
                        Price = s.UnitPrice_Areas.Price
                    }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [PageLogin]
        //get All sheet's user saved
        public JsonResult getAllSheets(string buildingitem_id)
        {
            if (buildingitem_id != null)
            {
                var sheets = _db.UserWorks.Where(i => i.BuildingItem_ID.Equals(buildingitem_id)).Select(i => new UserWorkViewModel(i)).ToList();
                var userworkresource = _db.UserWork_Resources.Where(i => i.BuildingItem_ID.Equals(buildingitem_id)).Select(i => new UserWorkResourceViewModel(i)).ToList();

                return Json(new { sheets = sheets, userworkresource = userworkresource }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("error", JsonRequestBehavior.AllowGet);
            }
        }

        //......
        //Get data follow action's user

        public JsonResult getAllResources(string buildingitem_id)
        {
            if (buildingitem_id != null)
            {
                var resources = _db.UserWork_Resources.Where(i => i.BuildingItem_ID.Equals(buildingitem_id)).Select(i => new UserWorkResourceViewModel(i)).ToList();
                return Json(resources, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("error", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult getGroupbyResources(string buildingitem_id)
        {
            if (buildingitem_id != null)
            {
                var resources = _db.UserWork_Resources.Where(i => i.BuildingItem_ID.Equals(buildingitem_id))
                    .GroupBy(i => new { i.UnitPrice_ID, i.Name, i.Unit, i.Price })
                    .Select(s => new UserWorkResourceViewModel
                    {
                        UnitPrice_ID = s.First().UnitPrice_ID,
                        Name = s.First().Name,
                        Unit = s.First().Unit,
                        Number_Norm = s.Sum(i => i.Number_Norm),
                        Price = s.First().Price

                    });
                return Json(resources, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("error", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetArea_Price()
        {
            var list = _db.Areas.Select(i => new AreaViewModel(i)).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetArea_PriceUser()
        {
            if (SessionHandler.User != null)
            {
                var list = _db.Areas.Where(i => i.Email.Equals(SessionHandler.User.Email)).Select(i => new AreaViewModel(i));
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("error");
            }
        }
        public JsonResult get_namebuilding(int id)
        {
            var idcongtrinh = _db.BuildingItems.Where(i => i.ID.Equals(id)).Select(i => i.Building_ID).FirstOrDefault();
            var list = _db.Buildings.Where(i => i.ID.Equals(idcongtrinh)).Select(i => new BuildingViewModel(i)).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_namebuildingitem(int id)
        {
            var list = _db.BuildingItems.Where(i => i.ID.Equals(id)).Select(i => new BuildingItemViewModel(i)).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //.....
        //save data


        [HttpPost]
        public JsonResult Save_SumAllWork(string price, int buildingitem_id)
        {
            try
            {
                var buildingitem = _db.BuildingItems.Where(i => i.ID.Equals(buildingitem_id)).FirstOrDefault();
                var old_price = buildingitem.Sum;

                if (buildingitem != null)
                {
                    var building = _db.Buildings.Where(i => i.ID.Equals(buildingitem.Building_ID)).FirstOrDefault();

                    if (old_price == 0)
                    {
                        buildingitem.Sum = Convert.ToDecimal(price, CultureInfo.InvariantCulture);

                        building.Sum = Convert.ToDecimal(building.Sum + buildingitem.Sum, CultureInfo.InvariantCulture);
                    }
                    else
                    {
                        buildingitem.Sum = Convert.ToDecimal(price, CultureInfo.InvariantCulture);

                        building.Sum = Convert.ToDecimal(building.Sum - old_price + buildingitem.Sum, CultureInfo.InvariantCulture);
                    }

                    _db.SubmitChanges();

                    return Json("ok");
                }
                else
                {
                    return Json("error");
                }

            }
            catch (Exception e)
            {
                return Json("error");
            }
        }

        [HttpPost]
        public JsonResult Save_Resource(List<UnitPrice_AreaViewModel> list)
        {
            try
            {
                foreach (var item in list)
                {
                    var upa = _db.UnitPrice_Areas.Where(i => i.Area_ID.Equals(item.Area_ID) && i.UnitPrice_ID.Equals(item.UnitPrice_ID)).FirstOrDefault();
                    if (upa != null)
                    {
                        upa.Price = item.Price;
                    }
                    else
                    {
                        UnitPrice_Area u = new UnitPrice_Area();
                        u.Area_ID = item.Area_ID;
                        u.UnitPrice_ID = item.UnitPrice_ID;
                        u.Price = item.Price;
                        _db.UnitPrice_Areas.InsertOnSubmit(u);
                    }
                    _db.SubmitChanges();
                }
                return Json("ok");
            }
            catch (Exception e)
            {
                return Json("error");
            }
        }

        [HttpPost]
        public JsonResult post_createUnitPrice(AreaViewModel model)
        {
            try
            {
                Area a = new Area();
                a.Email = SessionHandler.User.Email;
                a.Name = model.Name;
                a.Address = model.Address;
                _db.Areas.InsertOnSubmit(a);
                _db.SubmitChanges();

                return Json("ok");
            }
            catch (Exception e)
            {
                return Json("error");
            }

        }

        [HttpPost]
        public JsonResult post_savework(SaveUserWorkViewModel model)
        {
            try
            {
                if (model.BuildingItem_ID != 0)
                {
                    var work = _db.UserWorks.FirstOrDefault(i => i.BuildingItem_ID.Equals(model.BuildingItem_ID) && i.IndexSheet.Equals(model.IndexSheet));
                    if (work != null)
                    {
                        work.ID = model.ID;
                        work.NormWork_ID = model.NormWork_ID;
                        work.Name = model.Name;
                        work.Unit = model.Unit;
                        work.Number = Convert.ToDecimal(model.Number, CultureInfo.InvariantCulture);
                        work.Horizontal = Convert.ToDecimal(model.Horizontal, CultureInfo.InvariantCulture);
                        work.Vertical = Convert.ToDecimal(model.Vertical, CultureInfo.InvariantCulture);
                        work.Height = Convert.ToDecimal(model.Height, CultureInfo.InvariantCulture);
                        work.Area = Convert.ToDecimal(model.Area, CultureInfo.InvariantCulture);
                        work.PriceMaterial = Convert.ToDecimal(model.PriceMaterial, CultureInfo.InvariantCulture);
                        work.PriceLabor = Convert.ToDecimal(model.PriceLabor, CultureInfo.InvariantCulture);
                        work.PriceMachine = Convert.ToDecimal(model.PriceMachine, CultureInfo.InvariantCulture);
                    }
                    else
                    {
                        UserWork ew = new UserWork();
                        ew.BuildingItem_ID = model.BuildingItem_ID;
                        ew.Sub_BuildingItem_ID = model.Sub_BuildingItem_ID;
                        ew.IndexSheet = model.IndexSheet;
                        ew.ID = model.ID;
                        ew.NormWork_ID = model.NormWork_ID;
                        ew.Name = model.Name;
                        ew.Unit = model.Unit;
                        ew.Number = Convert.ToDecimal(model.Number, CultureInfo.InvariantCulture);
                        ew.Horizontal = Convert.ToDecimal(model.Horizontal, CultureInfo.InvariantCulture);
                        ew.Vertical = Convert.ToDecimal(model.Vertical, CultureInfo.InvariantCulture);
                        ew.Height = Convert.ToDecimal(model.Height, CultureInfo.InvariantCulture);
                        ew.Area = Convert.ToDecimal(model.Area, CultureInfo.InvariantCulture);
                        ew.PriceMaterial = Convert.ToDecimal(model.PriceMaterial, CultureInfo.InvariantCulture);
                        ew.PriceLabor = Convert.ToDecimal(model.PriceLabor, CultureInfo.InvariantCulture);
                        ew.PriceMachine = Convert.ToDecimal(model.PriceMachine, CultureInfo.InvariantCulture);

                        _db.UserWorks.InsertOnSubmit(ew);
                    }
                    _db.SubmitChanges();
                }
                return Json("ok");
            }
            catch (Exception)
            {
                return Json("error");
            }
        }

        [HttpPost]
        public JsonResult post_updatework(SaveUserWorkViewModel model)
        {
            try
            {
                if (model.BuildingItem_ID != 0)
                {
                    var work = _db.UserWorks.FirstOrDefault(i => i.BuildingItem_ID.Equals(model.BuildingItem_ID) && i.IndexSheet.Equals(model.IndexSheet));
                    if (work != null)
                    {
                        work.Area = Convert.ToDecimal(model.Area, CultureInfo.InvariantCulture);
                    }
                    _db.SubmitChanges();
                }
                return Json("ok");
            }
            catch (Exception)
            {
                return Json("error");
            }
        }

        [HttpPost]
        public JsonResult post_updateresource(List<UserWorkResourceViewModel> list)
        {
            try
            {
                if (list[0].BuildingItem_ID != 0)
                {
                    foreach (var item in list)
                    {
                        UserWork_Resource ewr = new UserWork_Resource();
                        ewr.BuildingItem_ID = item.BuildingItem_ID;
                        ewr.UserWork_ID = item.UserWork_ID;
                        ewr.UnitPrice_ID = item.UnitPrice_ID;
                        ewr.Name = item.Name;
                        ewr.Unit = item.Unit;
                        ewr.Number_Norm = item.Number_Norm;
                        ewr.Price = item.Price;
                        _db.UserWork_Resources.InsertOnSubmit(ewr);
                    }
                    _db.SubmitChanges();
                }
                return Json("ok");
            }
            catch (Exception)
            {
                return Json("error");
            }
        }

        [HttpPost]
        public JsonResult post_updateprice(SaveUserWorkResourceViewModel model)
        {
            try
            {
                if (model.BuildingItem_ID != null && model.UnitPrice_ID != null && model.Price != null)
                {
                    var list_userworkresource = _db.UserWork_Resources.Where(i => i.UnitPrice_ID.Equals(model.UnitPrice_ID) && i.BuildingItem_ID.Equals(model.BuildingItem_ID)).ToList();

                    foreach (var item in list_userworkresource)
                    {
                        item.Price = Convert.ToDecimal(model.Price, CultureInfo.InvariantCulture);
                    }
                    _db.SubmitChanges();

                    return Json("ok");
                }
                else
                {
                    return Json("error");
                }
            }
            catch (Exception e)
            {
                return Json("error");
            }
        }

        [HttpPost]
        public JsonResult post_addrow(string buildingitem_id, string id_work, string flag)
        {
            try
            {
                if (flag.Equals("0"))
                {
                    var id = Convert.ToInt32(id_work);

                    var list = _db.UserWorks.Where(i => i.BuildingItem_ID.Equals(buildingitem_id) && i.IndexSheet >= id).ToList();

                    if (list != null)
                    {
                        foreach (var item in list)
                        {
                            item.IndexSheet = item.IndexSheet + 1;
                        }
                        _db.SubmitChanges();
                    }
                }
                if (flag.Equals("1"))
                {
                    var id = Convert.ToInt32(id_work);

                    var list = _db.UserWorks.Where(i => i.BuildingItem_ID.Equals(buildingitem_id) && i.IndexSheet > id).ToList();

                    if (list != null)
                    {
                        foreach (var item in list)
                        {
                            item.IndexSheet = item.IndexSheet + 1;
                        }
                        _db.SubmitChanges();
                    }
                }

                return Json("ok");
            }
            catch (Exception e)
            {
                return Json("error");
            }
        }

    }
}
