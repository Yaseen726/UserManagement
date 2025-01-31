

const isLogin=async(req,res,next)=>{
    try {
        if(req.session.admin)
        {
        next()
        }
        else{
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error.message)
    }
}


const isLogout=async(req,res,next)=>{
    try {
        if(req.session.admin)
        {
            res.redirect("/admin/home")
        }
        else{
            next()
        }
    
    } catch (error) {
        console.log(error.message)
    }
}


const isAdmin = async(req,res, next)=> {
    try {   
        const userId = req.session.user
        if(userId) {
            return res.redirect('/')
        }
        return next();
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    isLogin,
    isLogout,
    isAdmin
};


