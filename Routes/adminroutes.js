const express = require("express");
const admin_route = express.Router();
const bodyparser = require("body-parser");
const session = require("express-session");
const config = require("../config/config");
const admincontroller = require("../controllers/adminController");
const auth = require("../middleware/adminauth");
admin_route.use(session({ secret: config.sessionSecret }));
admin_route.use(bodyparser.json());
admin_route.use(bodyparser.urlencoded({ extended: true }));
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/profile"));
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });
admin_route.get("/", auth.isAdmin, auth.isLogout, admincontroller.adminlogin);
admin_route.post("/", admincontroller.verifyadmin);
admin_route.get("/home", auth.isLogin, admincontroller.loadadhome);
admin_route.get("/logout", auth.isLogin, admincontroller.adminlogout);
admin_route.get("/home/admindash", auth.isLogin, admincontroller.admindash);
admin_route.get(
  "/home/admindash/userreg",
  auth.isLogin,
  admincontroller.adminuserreg
);
admin_route.post(
  "/home/admindash/userreg",
  upload.single("profilePic"),
  admincontroller.adminadd
);
admin_route.get("/home/admindash/edit", auth.isLogin, admincontroller.edituser);
admin_route.post("/home/admindash/edit", admincontroller.updateuser);

//admin edit routes
admin_route.get("/home/adminedit", auth.isLogin, admincontroller.editadmin);
admin_route.post("/home/adminedit", admincontroller.updateadmin);

admin_route.get(
  "/home/admindash/search",
  auth.isLogin,
  admincontroller.searchUser
);

admin_route.get("/home/admindash/delete", admincontroller.deleteuser);

admin_route.get("*", (req, res) => {
  res.redirect("/admin");
});
module.exports = admin_route;
