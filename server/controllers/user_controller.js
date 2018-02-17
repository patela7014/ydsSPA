var bcrypt = require('bcrypt-nodejs');
var uuidV4 = require('uuid/v4');

var db     = require('../models/db');

var User = require('../models/user');
let  crypto = require('crypto');
var async = require('async');

var formidable = require('formidable');
var fs = require('fs');
var path         = require('path');
var util = require('util');
const notifier = require('node-notifier');
var multer = require('multer');
var login_controller = require('../controllers/login');
let multiparty = require('multiparty');

const handleLogin = function(req, email, password, callback) {
    // Check that the user logging in exists

    let userData = req.body;
    db.query('SELECT * FROM login WHERE username = ?', [userData.email], function(err, rows) {
        if (err)
            return callback(err);

        if (!rows.length){
            return callback(null, false, req.flash('loginMessage', 'No user found.'));
        }

        if (!login_controller.validPassword(userData.password, rows[0].password)){
            return callback(null, false, req.flash('loginMessage', 'Wrong password.'));
        }


        // User successfully logged in, return user
        req.session.user = rows[0]
        // console.log('session',req.session)
        return callback(null,rows[0]);
    });
};

const updateUserImage = function(user_id, callback) {
    let form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {

        let userFields = JSON.parse(fields.userData)
        if(files.imageFile !== undefined){
            let {path: tempPath, originalFilename} = files.imageFile[0];
            let copyBasePath = global.__basedir+'/client/public/uploads/';

            let file_name = (user_id + path.extname(originalFilename)).toLowerCase();

            let copyToPath = copyBasePath+file_name;

            fs.readFile(tempPath, (err, data) => {
                // make copy of image to new location
                fs.writeFile(copyToPath, data, (err) => {
                    // delete temp image
                    fs.unlink(tempPath, () => {

                        save_user_image(user_id,file_name, ()=>{
                            res.send('success');
                        })

                    });
                });
            });


        }else if(fields.imageName){
            save_user_image(user_id,fields.imageName, ()=>{
                res.send('success');
            })
        }else{
            res.send("No File uploaded");
        }

    })
}



const save_user_data = function(fields, files, parent_callback){
    let input = JSON.parse(fields.userData);
    let file_name = fields.imageName;
    let user_id = input.u_id;
    decrypt_user_id(user_id,function (req,user_data) {
        async.parallel({
            update_user_image: function (callback) {
                if(files.imageFile !== undefined) {
                    let {path: tempPath, originalFilename} = files.imageFile[0];
                    let copyBasePath = global.__basedir + '/client/public/uploads/';

                    let file_name = (user_id + path.extname(originalFilename)).toLowerCase();

                    let copyToPath = copyBasePath + file_name;

                    fs.readFile(tempPath, (err, data) => {
                        // make copy of image to new location
                        fs.writeFile(copyToPath, data, (err) => {
                            // delete temp image
                            fs.unlink(tempPath, () => {

                                let sql_query = "UPDATE mukt set ? WHERE ?";
                                db.query(sql_query, [{profile_picture: file_name}, {id: user_data.id}], function (err, result) {
                                    if (err)
                                        return callback(err);

                                    callback(null, {success: true});
                                });

                            });
                        });
                    });
                }else{
                    let sql_query = "UPDATE mukt set ? WHERE ?";
                    db.query(sql_query, [{profile_picture: input.profile_picture}, {id: user_data.id}], function (err, result) {
                        if (err)
                            return callback(err);

                        callback(null, {success: true});
                    });
                }
            },
            update_user_address: function(callback) {
                let sql_query = "UPDATE address set ?,?,?,?,?  WHERE ?";

                db.query(sql_query, [{street:input.street},{apt:input.apt},{city:input.city},{state:input.state},{zip:input.zip},{user_id:user_data.id}],function (err,result) {
                    if (err)
                        return callback(err);

                    callback(null,{success:true});
                });
            },
            update_user_info: function(callback) {
                let sql_query = "UPDATE mukt set ?,?,?,?,?,?,?,?  WHERE ?";
                let birth_day = input.birth_day;
                let birth_month = input.birth_month;
                db.query(sql_query, [{ first_name: input.first_name },{ mid_name: input.mid_name }, { last_name: input.last_name},{email:input.email},{cell_phone:input.cell_phone},{home_phone:input.home_phone},{birth_day:birth_day},{birth_month:birth_month},{id:user_data.id}],function (err,result) {
                    if (err)
                        return callback(err);

                    callback(null,{success:true});
                });

            },
        }, function (err, results) {
            if (err)
                return parent_callback(err);

            parent_callback(null, {success:true})

        });
    });
}

exports.saveUser = function (req, res,callback) {

    let form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        save_user_data(fields, files, ()=>{
            res.send('success')
        })
    })
}

const decrypt_user_id = function(encrypted_user_id,callback){
    db.query('SELECT * FROM mukt WHERE HEX(AES_ENCRYPT(id, "yds_seva")) = ?',[encrypted_user_id], function(err, rows) {
        callback(null,rows[0]);
        // rows[0].id;
    });
};

function convertCryptKey(strKey) {
    let newKey = new Buffer([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    strKey = new Buffer(strKey);
    for(let i=0;i<strKey.length;i++) newKey[i%16]^=strKey[i];
    return newKey;
}

let encrypt_key = function(text, pass_key){
    let c = crypto.createCipheriv("aes-128-ecb", convertCryptKey(pass_key), "");
    let crypted = c.update(text, 'utf8', 'hex') + c.final('hex');
    return crypted.toUpperCase();
};

let decrypt_key = function(text, pass_key){
    let dc = crypto.createDecipheriv("aes-128-ecb", convertCryptKey(pass_key), "");
    return dc.update(text, 'hex', 'utf8') + dc.final('utf8');
};

const users = function(req,res){

    db.query('SELECT birth_day, MONTHNAME(concat("0000-",mukt.birth_month,"-00")) as month_name, mukt.*,address.street, address.city,address.state, address.zip,address.apt, HEX(AES_ENCRYPT(mukt.id, "yds_seva")) as u_id FROM mukt LEFT JOIN address ON address.user_id = mukt.id ORDER BY IF(birth_month < MONTH(NOW()), birth_month + 12, birth_month), IF(birth_day < day(NOW()), birth_day+31, birth_day)',[], function(err, rows) {
        if (err)
            return res.send({ error: 'Unable to retrieve users from database' }).status(500)

        res.send(rows).status(200)
    });

};

exports.view_user = function(req, res) {


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

exports.users = users;
exports.handleLogin = handleLogin;
