let db     = require('../models/db');
var uuid = require('uuid');

// Generate a v4 (random) UUID

const add_event = function(fields, files, parent_callback){

    console.log('fields', fields, files);
    return;
    let input = JSON.parse(fields.userData);
    let file_name = fields.imageName;
    let user_id = input.u_id;
    if(files.imageFile !== undefined) {

        let {path: tempPath, originalFilename} = files.imageFile[0];
        let copyBasePath = global.__basedir + '/client/public/uploads/';

        let file_name = (uuid.v4() + path.extname(originalFilename)).toLowerCase();

        let copyToPath = copyBasePath + file_name;
    }
    async.parallel({
        update_user_image: function (callback) {
            if(files.imageFile !== undefined) {
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
                let sql_query = "INSERT INTO event set ?,?,?,? WHERE ?";
                db.query(sql_query, [{profile_picture: input.profile_picture}, {id: user_data.id}], function (err, result) {
                    if (err)
                        return callback(err);

                    callback(null, {success: true});
                });
            }
        },
        update_user_address: function(callback) {
            let sql_query = "UPDATE address set ?,?,?,?,?  WHERE ?";

            db.query(sql_query, [{street:input.street},{apt:input.apt},{city:input.city},{state:input.state},{zip:input.zip},{id:user_data.id}],function (err,result) {
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
}

exports.create_event = function (req, res) {
    let form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        save_user_data(fields, files, ()=>{
            res.send('success')
        })
    })
}



