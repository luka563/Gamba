const validator = require("validator");
const User = require("../models/User");
exports.getLogin = (req, res) => {
  if (req.session.user) {
    return res.render("profile",{user:req.session.user});
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin =async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {   
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });
  let user
  try {    
    user = await User.findOne({email:req.body.email}).populate('likedGames')
  } catch (error) {
    console.log(error)
  }
    if(!user)
    return res.redirect("/login");

    if(! await user.comparePassword(req.body.password))
      return res.redirect("/login");
    
    req.session.user = user
    return res.render("profile",{user:user,likedGames:user.likedGames});    
};

exports.logout = (req, res) => { 
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};
exports.log


exports.getSignup = (req, res) => {
  if (req.session.user) {
    return res.render("profile",{user:req.session.user});
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {   
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    balance:0,
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {         
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
          req.session.user = user;
          res.render('profile',{user:user})
        });
      });
};