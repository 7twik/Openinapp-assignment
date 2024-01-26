const { hello } = require("../controller/controller");
const router = require("express").Router();
///////////////////For customers  ///////////////////////////
//REGISTER
router.get("/hello", hello);

module.exports = router;