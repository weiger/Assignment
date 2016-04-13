var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/food', function(req, res) {
    var db = req.db;
    var collection = db.get('food');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to adduser.
 */
router.post('/food', function(req, res) {
    var db = req.db;
    var collection = db.get('food');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/food/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('food');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
