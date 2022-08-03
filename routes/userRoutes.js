const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.route("/blocks/:username").get(userController.get_user_blocks);

router.route("/blocks/:login_name").post(userController.post_user_blocks);

module.exports = router;
