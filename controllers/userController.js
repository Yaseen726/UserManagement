const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const securepassword = async (password) => {
    try {
        const passwordhash = await bcrypt.hash(password, 10);
        return passwordhash;
    } catch (error) {
        console.log(error.message);
    }
};

const login = async (req, res) => {
    try {
        const message = req.query.message || "";
        req.session.currentPage = req.originalUrl;
        res.render("login", { message });
    } catch (error) {
        console.log(error.message);
    }
};

const loadRegister = async (req, res) => {
    try {
        const message = req.query.message || '';
        res.render("register", { message });
    } catch (error) {
        console.log(error.message);
    }
};
const insertUser = async (req, res) => {
    try {
        const { email, username, password, phone } = req.body;

       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect("/register?message=Email%20already%20registered");
        }

        
        const spassword = await securepassword(password);

       
        const user = new User({
            name: username, 
            email: email,
            password: spassword,
            phone: phone,
            is_Admin: 0,
            image: req.file.filename
        });

        // Save the user
        const userdata = await user.save();

        if (userdata) {
            res.redirect("/register?message=Your%20registration%20was%20successful");
        } else {
            res.redirect("/register?message=Registration%20failed");
        }
    } catch (error) {
        console.log(error.message);
        res.redirect("/register?message=An%20error%20occurred%20during%20registration");
    }
};

const verifylogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            if (userData.is_Admin === 1) {
                return res.redirect("/login?message=Admin access not allowed here");
            }

            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user = userData._id;
                res.redirect("/home");
            } else {
                res.redirect("/login?message=Invalid credentials");
            }
        } else {
            res.redirect("/login?message=Invalid credentials");
        }
    } catch (error) {
        console.log(error.message);
        res.redirect("/login?message=Login error");
    }
};

const loadhome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user });
        res.render("home", { user: userData });
    } catch (error) {
        console.log(error.message);
        res.redirect("/login?message=Error loading home page");
    }
};

const userlogout = async (req, res) => {
    try {
        req.session.user = null;
        res.redirect("/login");
    } catch (error) {
        console.log(error.message);
        res.redirect("/login?message=Logout error");
    }
};

const loadEditUser = async (req, res) => {
    try {
        const userData = await User.findById(req.session.user);
        res.render("editUser", { user: userData });
    } catch (error) {
        console.log(error.message);
        res.redirect("/home?message=Error loading edit page");
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.session.user;
        const updatedData = {
            email: req.body.email,
            phone: req.body.phone,
        };

        await User.findByIdAndUpdate(userId, updatedData);
        res.redirect("/home?message=Profile updated successfully");
    } catch (error) {
        console.log(error.message);
        res.redirect("/home/edit?message=Error updating profile");
    }
};
module.exports = {
    login,
    loadRegister,
    insertUser,
    loadhome,
    verifylogin,
    userlogout,
    loadEditUser,
    updateUser
};



