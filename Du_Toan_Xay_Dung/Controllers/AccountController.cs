using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Du_Toan_Xay_Dung.Models;
using Du_Toan_Xay_Dung.Handlers;
using Du_Toan_Xay_Dung.Helper;
using Du_Toan_Xay_Dung.Utils;

namespace Du_Toan_Xay_Dung.Controllers
{

    public class AccountController : Controller
    {
        DataDTXDDataContext _db = new DataDTXDDataContext();

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ValidateUser(FormCollection form)
        {
            string email = form["Email"];
            string matkhau = UserHelper.Encrypt(form["Password"]);

            SessionHandler.User = null;
            var user = _db.Users.Where(i => i.Email.Equals(email) && i.Password.Equals(matkhau)).FirstOrDefault();
            if (user != null)
            {
                if (user.Role == "user")
                {
                    var userviewmodel = new UserViewModel(user);
                    userviewmodel.Passwork = string.Empty;
                    SessionHandler.User = userviewmodel;
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    var userviewmodel = new UserViewModel(user);
                    userviewmodel.Passwork = string.Empty;
                    SessionHandler.User = userviewmodel;
                    return RedirectToAction("Index", "Admin");
                }
            }
            else
            {
                return RedirectToAction("Login","Account");
            }
        }

        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Post_Register(FormCollection form)
        {
            string First_Name = form["FirstName"];
            string Last_Name = form["LastName"];
            string Email = form["Email"];
            string Password = UserHelper.Encrypt(form["Password"]);
            string Role = "user";

            User user = new User()
            {
                Email = Email,
                Password = Password,
                First_Name = First_Name,
                Last_Name = Last_Name,
                Role = Role
            };

            _db.Users.InsertOnSubmit(user);
            _db.SubmitChanges();

            return RedirectToAction("Index", "Home");
        }

        public ActionResult Logout()
        {
            SessionHandler.User = null;
            return RedirectToAction("Login");
        }
        public ActionResult Forgot()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Forgot(String Email)
        {
            var user = _db.Users.Where(n => n.Email.Equals(Email)).FirstOrDefault();
            if (user == null)
            {
                ModelState.AddModelError("", "Sai tên đăng nhập !");
            }
            else if (user.Email != Email)
            {
                ModelState.AddModelError("", "Sai tên địa chỉ email !");
            }
            else
            {
                Xmail.Send(Email, "Forgot password", UserHelper.Decrypt(user.Password));
                ModelState.AddModelError("", "Mật khẩu đã được gửi qua email !");
            }
            return View();
        }

    }
}