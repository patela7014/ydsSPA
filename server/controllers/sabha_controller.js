const db     = require('../models/db');
const async = require('async');

exports.sabhas = function(req,res){
    db.query('SELECT * FROM sabha',[], function(err, rows) {
        if (err)
            return res.send({ error: 'Unable to retrieve sabhas from database' }).status(500)

        res.send(rows).status(200)
    });
};

exports.sabhaUsers = function(req,res){
    let {sabha_id, event_id} = req.params;
    async.parallel({
        get_sabha_users: function(callback) {
            db.query('SELECT * FROM sabha_muktos sm INNER JOIN mukt m ON m.id = sm.user_id WHERE sabha_id = ?',[sabha_id], function(err, rows) {
                callback(null,rows);
            });
        },
        get_event_attendance: function(callback) {
            db.query('SELECT user_id FROM event_attendance WHERE event_id = ? AND attended = 1',[event_id], function(err, rows) {
                callback(null,rows);
            });

        },
    }, function(err, results) {
        if (err)
            return console.log(err);

        res.send({all_users: results.get_sabha_users,attended:results.get_event_attendance}).status(200)

    });
};