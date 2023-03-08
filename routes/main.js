const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const gamesController = require("../controllers/gamesController");

const { ensureAuth } = require("../middleware/authMiddleware");


router.get("/user",(req,res)=>{})
router.get("/", homeController.getIndex);
router.get("/profile",/*ensureAuth,*/  homeController.getProfile);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/logout", authController.logout);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);


module.exports = router;