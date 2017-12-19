var bcrypt = require('bcrypt-nodejs');


// Hash and salt the password with bcrypt
const hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is correct
const validPassword = function(password, savedPassword) {
    return bcrypt.compareSync(password, savedPassword);
};

exports.hashPassword = hashPassword;
exports.validPassword = validPassword;

