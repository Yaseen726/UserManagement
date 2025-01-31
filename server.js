const express=require("express")
const app=express()
const session = require("express-session");
const bodyparser=require("body-parser")
const nocache = require("nocache");
const routes=require("./Routes/userroutes")
const admin_routes=require("./Routes/adminroutes")
const mongoose =require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/user-management")
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs")
app.set("views","./views")
app.use(nocache());
app.use(express.static("public"))
app.use("/",nocache(),routes)
app.use("/admin",nocache(),admin_routes)
app.listen(3000,()=>{
    console.log("server is running on port 3000");
})