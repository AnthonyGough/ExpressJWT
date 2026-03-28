var express = require('express');
var router = express.Router();



router.get('/', (req, res,next) => {
  res.render( 'index', {title: 'Welcome to IFN666', extra: 'Express JWT Tutorial'});
});

module.exports = router;
