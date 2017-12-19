var bcrypt = require('bcrypt-nodejs');
var db     = require('../models/db');
let  crypto = require('crypto');
var async = require('async');

var formidable = require('formidable');
var fs = require('fs');
var path         = require('path');
var util = require('util');
const notifier = require('node-notifier');
var multer = require('multer');
let multiparty = require('multiparty');

const events = function(req,res){
    db.query('SELECT e.*, ei.event_date, ei.description FROM event e INNER JOIN event_info ei ON ei.event_id = e.id ORDER BY ABS(DATEDIFF(NOW(), ei.event_date))',[], function(err, rows) {
        if (err)
            return res.send({ error: 'Unable to retrieve events from database' }).status(500)

        res.send(rows).status(200)
    });
};

exports.saveEventAttendance = function(req, res){
    let {included,excluded, event_id} = req.body;
    for(var i in included){
        let sql_query = "INSERT INTO event_attendance set ?,?,?";
        (function () {
            let cur_user = included[i];
            db.query("SELECT * FROM event_attendance WHERE event_id = ? AND user_id = ?",[event_id, cur_user], function(err, row) {
                if (err){
                    return res.send({ error: 'Unable to insert data' }).status(500)
                }
                if(!row[0]){
                    db.query(sql_query,[{event_id}, {user_id : parseInt(cur_user)}, {attended : 1}], function(err, rows) {
                        if (err){
                            return res.send({ error: 'Unable to insert data' }).status(500)
                        }
                    });
                }else{
                    sql_query = "UPDATE event_attendance set ? WHERE event_id = ? AND user_id = ?";

                    db.query(sql_query,[{attended : 1}, event_id, parseInt(cur_user)], function(err, rows) {
                        if (err){
                            return res.send({ error: 'Unable to insert data' }).status(500)
                        }
                    });
                }
            });
        }());
    }
    for(var i in excluded){
        let sql_query = "UPDATE event_attendance set ? WHERE event_id = ? AND user_id = ?";
        (function () {
            let cur_user = excluded[i];
            db.query("SELECT * FROM event_attendance WHERE event_id = ? AND user_id = ?",[event_id, cur_user], function(err, row) {
                if (err){
                    return res.send({ error: 'Unable to update data' }).status(500)
                }
                if(row[0]){
                    db.query(sql_query,[{attended : 0}, event_id, parseInt(cur_user)], function(err, rows) {
                        if (err){
                            return res.send({ error: 'Unable to delete data' }).status(500)
                        }
                    });
                }
            });
        }());
    }
    res.send({success : true}).status(200)
}

exports.view_event = function(req, res) {
    let user_id = req.params.user_id;
    let family_id = req.params.family_id;

    async.parallel({
        get_family_members_info: function(callback) {
            db.query('SELECT mukt.*,address.street, address.city,address.state, address.zip,address.apt FROM mukt INNER JOIN address ON address.user_id = mukt.id WHERE family_id = ? AND HEX(AES_ENCRYPT(mukt.id, "yds_seva")) != ?',[family_id,user_id], function(err, rows) {
                callback(null,rows);
            });
        },
        get_user_info: function(callback) {
            db.query('SELECT mukt.*,address.street, address.city,address.state, address.zip,address.apt, HEX(AES_ENCRYPT(mukt.id, "yds_seva")) as u_id  FROM mukt INNER JOIN address ON address.user_id = mukt.id WHERE HEX(AES_ENCRYPT(mukt.id, "yds_seva")) = ?',[user_id], function(err, rows) {
                callback(null,rows);
            });

        },
    }, function(err, results) {
        if (err)
            return console.log(err);

        res.send({family_data: results.get_family_members_info,user_data:results.get_user_info[0],user_id:user_id,mode:'Update'}).status(200)

    });
};

const saveEventData = function(fields, files, parent_callback){
    let input = JSON.parse(fields.data);

    async.waterfall([
        add_event(input),
        function (input, callback) {
            let sql_query = "INSERT INTO event_info set ?,?,?,?,?";
            db.query(sql_query, [{event_id:input.event_id},{description:input.event_description},{event_date:input.event_date},{street:input.event_address},{city:input.event_city}, ],function (err,result) {
                if (err)
                    return callback(err);

                callback(null,{success:true});
            });
        }
    ], function (error, success) {
        if (error) {
            console.log('Something is wrong!');
        }
        parent_callback(null, success)
    });
}

function add_event (input) {
    return function (callback) {
        let sql_query = "INSERT INTO event set ?,?";

        db.query(sql_query, [{title:input.event_title},{created_by:1}],function (err,result) {
            if (err)
                return callback(err);

            input.event_id = result.insertId;
            console.log('insert', input);
            callback(null,input);
        });
    }
}

exports.saveEvent = function (req, res,callback) {

    let form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        saveEventData(fields, files, ()=>{
            res.send('success')
        })
    })
}

exports.events = events;
