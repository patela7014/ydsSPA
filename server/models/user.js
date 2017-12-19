var bcrypt = require('bcrypt-nodejs');

// Set up User class
let User = function(user) {
    let that = Object.create(User.prototype);

    that.email    = user.email;
    //that.password = user.password;
    that.first_name = user.first_name;
    that.last_name = user.last_name;
    that.email = user.email;
    that.phone = user.phone;
    that.designation = user.designation;
    that.address = user.address;
    that.city = user.city;
    that.state = user.state;
    that.zip = user.zip;
    that.birth_date = user.birth_date;
    that.gender = user.gender;

    that.comparePassword = function(candidatePassword, savedPassword, callback) {
        bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
            if (err) { return callback(err); }

            callback(null, isMatch);
        });
    }
    return that;
};

exports.User = User;