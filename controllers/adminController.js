const User=require("../models/userModel")
const bcrypt=require("bcrypt")

const adminlogin=async(req,res)=>{
    try {
        const message=req.query.message || ""
        res.render("admin",{message})
    } catch (error) {
        console.log(error.message)
    }
}
const verifyadmin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userdata = await User.findOne({ email: email });
        
        if (userdata) {
            const passwordMatch = await bcrypt.compare(password, userdata.password);
            
            if (passwordMatch) {
                if (userdata.is_Admin === 1) {
                    req.session.currentPage = null;
                    req.session.admin = userdata._id;
                    res.redirect("/admin/home");
                } else {
                    res.redirect("/admin?message=You%20Are%20Not%20Authorized")
                }
            } else {
               res.redirect("/admin?message=Email%20and%20password%20are%20incorrect")
            }
        } else {
          res.redirect("/admin?message=Email%20and%20password%20are%20incorrect")
        }

    } catch (error) {
        console.log(error.message);
    }
};

const securepassword=async(password)=>{
    try {
       const passwordhash= await bcrypt.hash(password,10)
       return passwordhash
    } catch (error) {
        console.log(error.message)
    }
}

const loadadhome = async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.redirect("/admin");
        }
        const userdata = await User.findById({ _id: req.session.admin });
        res.render("adminhome", { admin: userdata });
    } catch (error) {
        console.log(error.message);
        res.redirect("/admin?message=Error loading admin page");
    }
};

const adminlogout = async (req, res) => {
    try {
        req.session.admin = null;
        res.redirect("/admin");
    } catch (error) {
        console.log(error.message);
    }
};

const admindash=async(req,res)=>{
    try {
        const userdata=await User.find({is_Admin:0})
        res.render("admindash",{users:userdata})
    } catch (error) {
        console.log(error.message)
    }
}
const adminuserreg=async(req,res)=>{
    try {
        const message=req.query.message||""
        res.render("adminuserreg",{message})
    } catch (error) {
        console.log(error.message)
    }
}

const adminadd = async (req, res) => {
    try {
        const spassword = await securepassword(req.body.password);
        const name = req.body.username;
        const password = spassword;
        const email = req.body.email;
        const phone = req.body.phone;
        const image = req.file.filename;

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect("/admin/home/admindash/userreg?message=Email%20already%20registered");
        }

        
        const user = new User({
            name,
            email,
            password,
            phone,
            image,
            is_Admin: 0
        });

        const userdata = await user.save();

        if (userdata) {
            return res.redirect("/admin/home/admindash/userreg?message=User%20Successfully%20Registered");
        } else {
            return res.redirect("/admin/home/admindash/userreg?message=Registration%20Failed");
        }
    } catch (error) {
        console.log(error.message);
        return res.redirect("/admin/home/admindash/userreg?message=An%20error%20occurred");
    }
};

const edituser=async(req,res)=>{
   try {
    const id=req.query.id
   const userdata= await User.findById({_id:id})
   if(userdata)
   {
    res.render("useradminedit",{user:userdata})
   }
   else{
    res.redirect("/home/admindash/edit")
   }
   } catch (error) {
    console.log(error.message)
   }
}


const updateuser=async(req,res)=>{
    try {
        const userdata=await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,phone:req.body.phone}})
        res.redirect("/admin/home/admindash")
    } catch (error) {
        console.log(error.message)
    }
}


const editadmin = async (req, res) => {
    try {
        const id = req.query.id;
        const admindata = await User.findById({ _id: id});  

        if (admindata) {
           
            res.render("adminedit", { admin: admindata });
        } else {
        
            res.redirect("/admin/home");
        }
    } catch (error) {
        console.log(error.message);  
    }
}
const updateadmin = async (req, res) => {
    try {
        const admindata = await User.findByIdAndUpdate(
            { _id: req.body.id },
            { $set: { email: req.body.email, phone: req.body.phone } },
        );

        res.redirect("/admin/home");

    } catch (error) {
        console.log(error.message); 
    }
}
const searchUser = async (req, res) => {
    try {
        const searchQuery = req.query.username;
        const searchResults = await User.find({
            is_Admin: 0,  
            name: { $regex: new RegExp(searchQuery, 'i') }  
        });

        res.render("admindash", { users: searchResults });
    } catch (error) {
        console.log(error.message);
        res.render("admindash", { users: [] });
    }
};

const deleteuser=async(req,res)=>{
    try {
        const id=req.query.id
        await User.deleteOne({_id:id})
        res.redirect("/admin/home/admindash")

    } catch (error) {
        console.log(error.message)
    }
}


module.exports={
     adminlogin,
     verifyadmin,
     loadadhome,
     adminlogout,
     admindash,
     adminuserreg,
     adminadd,
     edituser,
     updateuser,
     editadmin,
     updateadmin,
     searchUser,
     deleteuser,
}






