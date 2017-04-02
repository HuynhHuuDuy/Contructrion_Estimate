using OfficeOpenXml;
using Du_Toan_Xay_Dung.Filter;
using System.Web.Mvc;
using Du_Toan_Xay_Dung.Models;
using Du_Toan_Xay_Dung.Handlers;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
//using CRUDDeom.Models;
using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Xml;
using System.Data.OleDb;
//using CRUDDeom.Models;
using PagedList.Mvc;
using PagedList;
namespace Du_Toan_Xay_Dung.Controllers
{
    
    public class AdminController : Controller
    {
        DataDTXDDataContext _db = new DataDTXDDataContext();
        public ActionResult Index()
        {
            ViewBag.Title = "Dự toán xây dựng";
            return View();
        }
        public ViewResult themnguoidung()
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return View("Login", "Account");
            }
            ViewBag.Title = "Dự toán xây dựng";
            return View();
        }
        public JsonResult get_alldongia()
        {
            var list = (from n in _db.UnitPrices
                        join a in _db.UnitPrice_Areas
                        on n.ID equals a.UnitPrice_ID
                        join b in _db.Areas
                        on a.Area_ID equals b.ID
                        select new DonGiaDTO
                        {
                            Ma=n.ID,
                            TenKhuVuc=b.Name,
                            Ten=n.Name,
                            DonVi=n.Unit,
                            Gia=a.Price,
                            KhuVuc=a.Area_ID
                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult get_alluser()
        {
            var list = (from n in _db.Users
                        select new NguoiDungDTO
                        {
                            Email=n.Email,
                            First_Name=n.First_Name,
                            Last_Name=n.Last_Name,
                            Phone=n.Phone,
                            Password=n.Password,
                            Workplace=n.Workplace,
                            City=n.City,
                            Role=n.Role
                        }).ToList();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //public JsonResult suanguoidung(NguoiDungDTO model)
        //{
        //    var nguoidung = _db.Users.Where(i => i.Email.Equals(Email)).Select(i => new UserViewModel(i)).FirstOrDefault();     
        //    return View(nguoidung);
        //}
        [HttpPost]
        public JsonResult post_suanguoidung(NguoiDungDTO model)
        {
            var nguoidung = _db.Users.First(m => m.Email == model.Email);
          
            // gán dữ liệu
            nguoidung.Email = model.Email;
            nguoidung.First_Name = model.First_Name;
            nguoidung.Last_Name = model.Last_Name;
            nguoidung.City = model.City;
            nguoidung.Workplace = model.Workplace;
            nguoidung.Phone = model.Phone;
            //nguoidung.Password = model.Password;
            // thực thi câu truy vấn
            UpdateModel(nguoidung);
            _db.SubmitChanges();
            return Json("ok", JsonRequestBehavior.AllowGet);
        }
        public IEnumerable<User> ListAllPageging1(int page, int pagesize)
        {
            return _db.Users.OrderByDescending(x => x.First_Name).ToPagedList(page, pagesize);
        }
        public ActionResult suaxoanguoidung(int page = 1, int pagesize = 10)
        {
            //if (SessionHandler.User != null)
            //{
            //    var user = SessionHandler.User;
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Account");
            //}
            ViewBag.Title = "Dự toán xây dựng";
            var model = ListAllPageging1(page, pagesize);
            return View(model);

        }
       
        public ActionResult upload()
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            return View();
        }

        [HttpPost]
        public ActionResult upload(HttpPostedFileBase file)
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            DataSet ds = new DataSet();
            if (Request.Files["file"].ContentLength > 0)
            {
                string fileExtension =
                                     System.IO.Path.GetExtension(Request.Files["file"].FileName);

                if (fileExtension == ".xls" || fileExtension == ".xlsx")
                {
                    string fileLocation = Server.MapPath("~/Upload/") + Request.Files["file"].FileName;
                    if (System.IO.File.Exists(fileLocation))
                    {
                        System.IO.File.Delete(fileLocation);
                    }
                    Request.Files["file"].SaveAs(fileLocation);
                    string excelConnectionString = string.Empty;
                    excelConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + fileLocation + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                    //connection String for xls file format.
                    if (fileExtension == ".xls")
                    {
                        excelConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" +
                        fileLocation + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                    }
                    //connection String for xlsx file format.
                    else if (fileExtension == ".xlsx")
                    {
                        excelConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" +
                        fileLocation + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                    }
                    //Create Connection to Excel work book and add oledb namespace
                    OleDbConnection excelConnection = new OleDbConnection(excelConnectionString);
                    excelConnection.Open();
                    DataTable dt = new DataTable();

                    dt = excelConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                    if (dt == null)
                    {
                        return null;
                    }

                    String[] excelSheets = new String[dt.Rows.Count];
                    int t = 0;
                    //excel data saves in temp file here.
                    foreach (DataRow row in dt.Rows)
                    {
                        excelSheets[t] = row["TABLE_NAME"].ToString();
                        t++;
                    }
                    OleDbConnection excelConnection1 = new OleDbConnection(excelConnectionString);


                    string query = string.Format("Select * from [{0}]", excelSheets[0]);
                    using (OleDbDataAdapter dataAdapter = new OleDbDataAdapter(query, excelConnection1))
                    {
                        dataAdapter.Fill(ds);
                    }
                }
                if (fileExtension.ToString().ToLower().Equals(".xml"))
                {
                    string fileLocation = Server.MapPath("~/Upload/") + Request.Files["FileUpload"].FileName;
                    if (System.IO.File.Exists(fileLocation))
                    {
                        System.IO.File.Delete(fileLocation);
                    }

                    Request.Files["FileUpload"].SaveAs(fileLocation);
                    XmlTextReader xmlreader = new XmlTextReader(fileLocation);
                    // DataSet ds = new DataSet();
                    ds.ReadXml(xmlreader);
                    xmlreader.Close();
                }

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    var khuvuc = new Area();
                    var dongia = new UnitPrice();
                    var dongia_khuvuc = new UnitPrice_Area();
                    khuvuc.ID = Convert.ToInt64(ds.Tables[0].Rows[i][0].ToString());
                    dongia.ID = ds.Tables[0].Rows[i][1].ToString();
                    dongia_khuvuc.Area_ID = Convert.ToInt64(ds.Tables[0].Rows[i][0].ToString());
                    dongia_khuvuc.UnitPrice_ID = ds.Tables[0].Rows[i][1].ToString();
                    dongia.Name = ds.Tables[0].Rows[i][2].ToString();
                    dongia.Unit = ds.Tables[0].Rows[i][3].ToString();
                    dongia_khuvuc.Price = Convert.ToDecimal(ds.Tables[0].Rows[i][4].ToString());
                    _db.Areas.InsertOnSubmit(khuvuc);
                    _db.UnitPrices.InsertOnSubmit(dongia);
                    _db.UnitPrice_Areas.InsertOnSubmit(dongia_khuvuc);
                }
                _db.SubmitChanges();

            }
            return RedirectToAction("danhsachdongia");
        }

        public ActionResult uploadinhmuc()
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.Title = "Dự toán xây dựng";
            return View();
        }
        [HttpPost]
        public ActionResult post_uploaddinhmuc(HttpPostedFileBase file)
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            DataSet ds = new DataSet();
            if (Request.Files["file"].ContentLength > 0)
            {
                string fileExtension =
                                     System.IO.Path.GetExtension(Request.Files["file"].FileName);

                if (fileExtension == ".xls" || fileExtension == ".xlsx")
                {
                    string fileLocation = Server.MapPath("~/Upload/") + Request.Files["file"].FileName;
                    if (System.IO.File.Exists(fileLocation))
                    {
                        System.IO.File.Delete(fileLocation);
                    }
                    Request.Files["file"].SaveAs(fileLocation);
                    string excelConnectionString = string.Empty;
                    excelConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + fileLocation + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                    //connection String for xls file format.
                    if (fileExtension == ".xls")
                    {
                        excelConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" +
                        fileLocation + ";Extended Properties=\"Excel 8.0;HDR=Yes;IMEX=2\"";
                    }
                    //connection String for xlsx file format.
                    else if (fileExtension == ".xlsx")
                    {
                        excelConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" +
                        fileLocation + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                    }
                    //Create Connection to Excel work book and add oledb namespace
                    OleDbConnection excelConnection = new OleDbConnection(excelConnectionString);
                    excelConnection.Open();
                    DataTable dt = new DataTable();

                    dt = excelConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                    if (dt == null)
                    {
                        return null;
                    }

                    String[] excelSheets = new String[dt.Rows.Count];
                    int t = 0;
                    //excel data saves in temp file here.
                    foreach (DataRow row in dt.Rows)
                    {
                        excelSheets[t] = row["TABLE_NAME"].ToString();
                        t++;
                    }
                    OleDbConnection excelConnection1 = new OleDbConnection(excelConnectionString);


                    string query = string.Format("Select * from [{0}]", excelSheets[0]);
                    using (OleDbDataAdapter dataAdapter = new OleDbDataAdapter(query, excelConnection1))
                    {
                        dataAdapter.Fill(ds);
                    }
                }
                if (fileExtension.ToString().ToLower().Equals(".xml"))
                {
                    string fileLocation = Server.MapPath("~/Upload/") + Request.Files["FileUpload"].FileName;
                    if (System.IO.File.Exists(fileLocation))
                    {
                        System.IO.File.Delete(fileLocation);
                    }

                    Request.Files["FileUpload"].SaveAs(fileLocation);
                    XmlTextReader xmlreader = new XmlTextReader(fileLocation);
                    // DataSet ds = new DataSet();
                    ds.ReadXml(xmlreader);
                    xmlreader.Close();
                }

                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    var dmuc = new NormWork();
                    dmuc.ID = ds.Tables[0].Rows[i][0].ToString();
                    dmuc.Name = ds.Tables[0].Rows[i][1].ToString();
                    dmuc.Unit = ds.Tables[0].Rows[i][3].ToString();

                    _db.NormWorks.InsertOnSubmit(dmuc);
                }
                _db.SubmitChanges();

            }
            return View();
        }
        public ActionResult nhapdinhmuc()
        {

            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            ViewBag.Title = "Dự toán xây dựng";
            ViewData["DSDonGia"] = _db.UnitPrices.Select(i => new DonGiaViewModel(i)).ToList();
            return View();
        }
        [HttpPost]
        public ActionResult post_nhapdinhmuc(FormCollection form)
        {
            try
            {
                // nhận dữ liệu từ form
                var madinhmuc = form["madinhmuc"];
                var tendinhmuc = form["tendinhmuc"];
                var donvidinhmuc = form["donvi"];
                var makhuvuc = form["makhuvuc"];
                var mathanhphan = form["mathanhphan"];
                string[] amathanhphan = mathanhphan.Split(new Char[] { ',' });
                var tenthanhphan = form["ten"];
                string[] atenthanhphan = tenthanhphan.Split(new Char[] { ',' });
                var rangbuoc = form["rangbuoc"];
                string[] arangbuoc = rangbuoc.Split(new Char[] { ',' });
                var haophi = form["haophi1"];
                string[] ahaophi = haophi.Split(new Char[] { ',' });
                var donvithanhphan = form["donvithanhphan"];
                string[] adonvithanhphan = donvithanhphan.Split(new Char[] { ',' });
                for (var i = 0; i < amathanhphan.Length; i++)
                {
                    NormDetail dgia = new NormDetail()
                    {

                        NormWork_ID = madinhmuc,
                        UnitPrice_ID = amathanhphan[i].ToString(),
                        Numbers = Convert.ToDecimal(ahaophi[i].ToString()),

                    };
                    _db.NormDetails.InsertOnSubmit(dgia);
                    _db.SubmitChanges();
                }
                // nhập dữ liệu cho đối tượng
                NormWork dmuc = new NormWork()
                {
                    ID = madinhmuc,
                    Name = tendinhmuc,
                    Unit = donvidinhmuc,
                };
                _db.NormWorks.InsertOnSubmit(dmuc);
                _db.SubmitChanges();

                ViewData["DSDonGia"] = _db.UnitPrices.Select(i => new DonGiaViewModel(i)).ToList();
                ModelState.AddModelError("", "Nhập thành công");
                
                
            }
            catch
            {
                ViewData["DSDonGia"] = _db.UnitPrices.Select(i => new DonGiaViewModel(i)).ToList();
                ModelState.AddModelError("", "Nhập thất bại");
            }
            return View();

        }
        [HttpPost]
        public JsonResult Post_themnguoidung(UserViewModel obj)
        {
           try
            {
                User user = new User()
                {
                    Email = obj.Email,
                    Password = obj.Passwork,
                    First_Name = obj.First_Name,
                    Last_Name = obj.Last_Name,
                    Role = "user",
                    Workplace = obj.WorkPlace,
                    City = obj.City,
                    Phone = obj.Phone,
                };
                _db.Users.InsertOnSubmit(user);
                _db.SubmitChanges();
                return Json("ok");

           }
           catch {
                return Json("error");
           }
           
        }
        public ActionResult Delete(string email)
        {

            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            User nguoidung = new User();
            nguoidung = _db.Users.Where(i => i.Email.Equals(email)).FirstOrDefault();
            var congtrinh = _db.Buildings.Where(i => i.Email.Equals(email)).ToList();
            if(congtrinh.Count>0)
            {
                for(var i=0;i<congtrinh.Count;i++)
                {
                    _db.Buildings.DeleteOnSubmit(congtrinh[i]);
                }
            }

            _db.Users.DeleteOnSubmit(nguoidung);
            _db.SubmitChanges();
            return RedirectToAction("suaxoanguoidung");
        }
        [HttpPost]
        public ActionResult timkiemnguoidung(FormCollection f, int? page)
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            string tukhoa = f["txttimkiem"].ToString();
            ViewBag.tukhoa = tukhoa;
            List<User> listnguoidung = _db.Users.Where(n => n.Last_Name.Contains(tukhoa)).ToList();
            // phân trang
            int pagenumber = (page ?? 1);
            int pagesize = 10;
            if (listnguoidung.Count == 0)
            {
                ViewBag.ThongBao = "Không tìm thấy bản ghi phù hợp";
                return View(_db.Users.OrderBy(n => n.Last_Name).ToPagedList(pagenumber, pagesize));
            }
            ViewBag.ThongBao = "Đã tìm thấy" + "    " + listnguoidung.Count + "kết quả";
            return View(listnguoidung.OrderBy(n => n.Last_Name).ToPagedList(pagenumber, pagesize));
        }
        [HttpGet]
        public ActionResult timkiemnguoidung(string tukhoa, int? page)
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            string tukhoa1 = tukhoa;
            ViewBag.tukhoa = tukhoa1;
            List<User> listnguoidung = _db.Users.Where(n => n.Last_Name.Contains(tukhoa)).ToList();
            // phân trang
            int pagenumber = (page ?? 1);
            int pagesize = 10;
            if (listnguoidung.Count == 0)
            {
                ViewBag.ThongBao = "Không tìm thấy bản ghi phù hợp";
                return View(_db.UnitPrices.OrderBy(n => n.Name).ToPagedList(pagenumber, pagesize));
            }
            ViewBag.ThongBao = "Đã tìm thấy" + listnguoidung.Count + "kết quả";
            return View(listnguoidung.OrderBy(n => n.Last_Name).ToPagedList(pagenumber, pagesize));
        }
        [HttpPost]
        public ActionResult timkiem(FormCollection f, int? page)
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            string tukhoa = f["txttimkiem"].ToString();
            ViewBag.tukhoa = tukhoa;
            List<UnitPrice> listdongia = _db.UnitPrices.Where(n => n.Name.Contains(tukhoa)).ToList();
            // phân trang
            int pagenumber = (page ?? 1);
            int pagesize = 10;
            if (listdongia.Count == 0)
            {
                ViewBag.ThongBao = "Không tìm thấy bản ghi phù hợp";
                return View(_db.UnitPrices.OrderBy(n => n.Name).ToPagedList(pagenumber, pagesize));
            }
            ViewBag.ThongBao = "Đã tìm thấy" + "    " + listdongia.Count + "kết quả";
            return View(listdongia.OrderBy(n => n.Name).ToPagedList(pagenumber, pagesize));
        }
        [HttpGet]
        public ActionResult timkiem(string tukhoa, int? page)
        {
            if (SessionHandler.User != null)
            {
                var user = SessionHandler.User;
            }
            else
            {
                return RedirectToAction("Login", "Account");
            }
            string tukhoa1 = tukhoa;
            ViewBag.tukhoa = tukhoa1;
            List<UnitPrice> listdongia = _db.UnitPrices.Where(n => n.Name.Contains(tukhoa)).ToList();
            // phân trang
            int pagenumber = (page ?? 1);
            int pagesize = 10;
            if (listdongia.Count == 0)
            {
                ViewBag.ThongBao = "Không tìm thấy bản ghi phù hợp";
                return View(_db.UnitPrices.OrderBy(n => n.Name).ToPagedList(pagenumber, pagesize));
            }
            ViewBag.ThongBao = "Đã tìm thấy" + listdongia.Count + "kết quả";
            return View(listdongia.OrderBy(n => n.Name).ToPagedList(pagenumber, pagesize));
        }
        public IEnumerable<UnitPrice> ListAllPageging(int page, int pagesize)
        {
            return _db.UnitPrices.OrderByDescending(x => x.ID).ToPagedList(page, pagesize);
        }
        public ActionResult danhsachdongia(int page = 1, int pagesize = 10)
        {
            //if (SessionHandler.User != null)
            //{
            //    var user = SessionHandler.User;
            //}
            //else
            //{
            //    return RedirectToAction("Login", "Account");
            //}
            var model = ListAllPageging(page, pagesize);
            return View(model);
        }
        public ActionResult suadongia(string MaVL_NC_MTC)
        {
            ViewData["dongia"] = _db.UnitPrices.Where(i => i.ID.Contains(MaVL_NC_MTC)).Select(i => new DonGiaViewModel(i)).FirstOrDefault();
            ViewData["dongia_khuvuc"] = _db.UnitPrice_Areas.Where(i => i.UnitPrice_ID.Contains(MaVL_NC_MTC)).Select(i => new UnitPrice_AreaViewModel(i)).FirstOrDefault();
           
            return View();
        }
        [HttpPost]
        public JsonResult post_suadongia(DonGiaDTO model)
        {
            
            var dongia = _db.UnitPrices.First(n => n.ID.Equals(model.Ma));
            var dongia_khuvuc = _db.UnitPrice_Areas.First(i => i.UnitPrice_ID.Equals(model.Ma)&&i.Area_ID.Equals(model.KhuVuc));
       
            // gán dữ liệu
            dongia_khuvuc.Price = model.Gia;
            dongia.Unit = model.DonVi;
            dongia.ID = model.Ma;
            dongia.Name = model.Ten;
            // thực thi câu truy vấn
            UpdateModel(dongia);
            UpdateModel(dongia_khuvuc);
            _db.SubmitChanges();
            return Json("ok", JsonRequestBehavior.AllowGet);
        }
       
      
     
    }
}





