var express = require('express');
var router = express.Router();

router.get('/total', function(req, res) {
    var db = req.db;
    var collection = db.get('food');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;
