var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/getJSON", function (req, res, next) {
  console.log("click!");

  res.json({
    result: "success",
  });
});

module.exports = router;
