const express = require("express");
const router = express.Router();
const gamesController = require("../controllers/gamesController");



router.get("/", gamesController.getAllGames);
router.post("/add",gamesController.addGame);
router.get("/:name",gamesController.getGame);
router.post("/:name",gamesController.playGame);
router.put("/addToFavorites/:name",gamesController.addFavoriteGame);
router.put("/removeFromFavorites/:name",gamesController.removeFromFavoriteGames)

module.exports = router;