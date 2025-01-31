const express=require("express")
const router=express.Router()
const usercontroller=require("../controllers/userController")
const bodyparser=require("body-parser")
const session=require("express-session")
const config=require("../config/config")
const auth=require("../middleware/auth")
const path=require("path")
const multer=require("multer")
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/images/profile"))
    },
     filename:(req,file,cb)=>{
        const name=Date.now()+"-"+file.originalname
        cb(null,name)
     }
})
const upload=multer({storage:storage})
//routes for login page
router.get("/",auth.isUser,auth.isLogout,usercontroller.login)//changed here
//routes for admin page
//routes for register page
router.get("/register",auth.isUser,auth.isLogout,usercontroller.loadRegister)
router.post("/register",upload.single("image"),usercontroller.insertUser)
router.post("/login",usercontroller.verifylogin)
router.get("/home",auth.isLogin,usercontroller.loadhome)
router.get("/logout",auth.isLogin,usercontroller.userlogout)
//new change
router.get("/login",auth.isUser, auth.isLogout, usercontroller.login);//changed here

router.get("/home/edit", auth.isLogin, usercontroller.loadEditUser);

// Route to handle update logic
router.post("/home/edit", auth.isLogin, usercontroller.updateUser);
module.exports=router