const bcrypt = require('bcrypt');
var config = require("config");

function hash_password(password){ // mã hóa password
    var saltRounds = config.get("salt"); // độ dài

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt); // chè password của mình vào

    return hash;
}

function compare_password(password, hash){ // giải mã password
    return bcrypt.compareSync(password, hash); // true
}

module.exports = {
    hash_password : hash_password,
    compare_password: compare_password
}