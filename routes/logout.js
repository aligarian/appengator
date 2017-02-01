var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

module.exports = router;