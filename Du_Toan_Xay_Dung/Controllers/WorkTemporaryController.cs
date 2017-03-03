using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Du_Toan_Xay_Dung.Models;
using Du_Toan_Xay_Dung.Handlers;
using Du_Toan_Xay_Dung.Filter;
using System.Data;
using System.Globalization;

namespace Du_Toan_Xay_Dung.Controllers
{
    public class WorkTemporaryController : Controller
    {

        public DataDTXDDataContext _db = new DataDTXDDataContext();

        //
        // GET: /WorkTemporary/
        [PageLogin]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Get_UserNormWork()
        {
            if (SessionHandler.User != null)
            {
                var list = _db.User_NormWorks.Where(i => i.Email.Equals(SessionHandler.User.Email)).Select(i => new User_NormWorkViewModel(i)).ToList();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("error", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetArea_UnitPrice()
        {
            //var admin = _db.Users.Where(i => i.Role.Equals("user")).FirstOrDefault();
            //var list = _db.Areas.Where(i => i.Email.Equals(admin.Email) && i.Email.Equals(SessionHandler.User.Email)).Select(i => new AreaViewModel(i)).ToList();
            var list = _db.Areas.Select(i => new AreaViewModel(i)).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Get_UnitPrice(string id)
        {
            if (SessionHandler.User != null)
            {
                var list = _db.UnitPrices.Join(_db.UnitPrice_Areas, up => up.ID, upa => upa.UnitPrice_ID, (up, upa) => new { Unit_Price = up, UnitPrice_Area = upa }).Where(i => i.UnitPrice_Area.Area_ID.Equals(id))
                .Select(s => new
                {
                    Area_ID = s.UnitPrice_Area.Area_ID,
                    UnitPrice_ID = s.Unit_Price.ID,
                    Price = s.UnitPrice_Area.Price,
                    Name = s.Unit_Price.Name,
                    Unit = s.Unit_Price.Unit,
                }).ToList();
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("error");
            }

        }

        [PageLogin]
        [HttpPost]
        public JsonResult post_saveUser_NormWork(User_NormWorkViewModel model)
        {
            try
            {
                var list_und = _db.User_NormDetails.Where(i => i.UserNormWork_ID.Equals(model.NormWork_ID)).ToList();
                var unw = _db.User_NormWorks.Where(i => i.NormWork_ID.Equals(model.NormWork_ID)).FirstOrDefault();

                //update
                if (list_und.Count != 0 && unw != null)
                {

                    _db.User_NormDetails.DeleteAllOnSubmit(list_und);
                    _db.SubmitChanges();

                    unw.NormWork_ID = model.NormWork_ID;
                    unw.Email = SessionHandler.User.Email;
                    unw.Name = model.Name;
                    unw.Unit = model.Unit;

                    foreach (var item in model.Norm_Details)
                    {
                        User_NormDetail und = new User_NormDetail();
                        und.UserNormWork_ID = model.NormWork_ID;
                        und.UnitPrice_ID = item.UnitPrice_ID;
                        und.Number = Convert.ToDecimal(item.Number, CultureInfo.InvariantCulture);
                        unw.User_NormDetails.Add(und);
                    }
                }
                else
                {
                    unw = new User_NormWork();
                    unw.NormWork_ID = model.NormWork_ID;
                    unw.Email = SessionHandler.User.Email;
                    unw.Name = model.Name;
                    unw.Unit = model.Unit;

                    _db.User_NormWorks.InsertOnSubmit(unw);

                    foreach (var item in model.Norm_Details)
                    {
                        User_NormDetail und = new User_NormDetail();
                        und.UserNormWork_ID = model.NormWork_ID;
                        und.UnitPrice_ID = item.UnitPrice_ID;
                        und.Number = Convert.ToDecimal(item.Number, CultureInfo.InvariantCulture);
                        unw.User_NormDetails.Add(und);
                    }
                }

                _db.SubmitChanges();

                return Json("ok");
            }
            catch (Exception e)
            {
                return Json("error");
            }

        }

        [PageLogin]
        public JsonResult Get_UserNormWorkDetail(string id)
        {
            var list = _db.User_NormDetails.Join(_db.UnitPrices, und => und.UnitPrice_ID, up => up.ID, (und, up) => new { User_NormDetail = und, UnitPrice = up }).Where(i => i.User_NormDetail.UserNormWork_ID.Equals(id))
                .Select(s => new
                {
                    UnitPrice_ID = s.UnitPrice.ID,
                    Number = s.User_NormDetail.Number,
                    Name = s.UnitPrice.Name,
                    Unit = s.UnitPrice.Unit
                }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [PageLogin]
        public JsonResult Validation_ID(string id)
        {
            var item = _db.User_NormWorks.Where(i => i.NormWork_ID.Equals(id)).FirstOrDefault();
            if (item != null)
            {
                return Json("error", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("ok", JsonRequestBehavior.AllowGet);
            }
            
        }

        [PageLogin]
        [HttpPost]
        public JsonResult post_deleteUser_NormWork(string id)
        {
            try
            {
                var list_und = _db.User_NormDetails.Where(i => i.UserNormWork_ID.Equals(id)).ToList();
                var unw = _db.User_NormWorks.Where(i => i.NormWork_ID.Equals(id)).FirstOrDefault();

                if (list_und.Count != 0 && unw != null)
                {
                    _db.User_NormDetails.DeleteAllOnSubmit(list_und);
                    _db.User_NormWorks.DeleteOnSubmit(unw);
                }
                _db.SubmitChanges();

                return Json("ok");
            }
            catch (Exception e)
            {
                return Json("error");
            }

        }

    }
}