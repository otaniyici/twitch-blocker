const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.route("/twitch").get(authController.getAuthCode);

router.route("/twitch/success").get(authController.getAccessToken);

module.exports = router;
