﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Du_Toan_Xay_Dung.Controllers
{
    public class NewsController : Controller
    {
        //
        // GET: /News/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CES()
        {
            return View();
        }
	}
}