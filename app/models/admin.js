var user_Model = require('../database/data_user');
var q = require("q"); // khai báo promise


// insert vào DB ==> ĐĂNG KÝ TÀI KHOẢN
function addUser (email, password, first_name, last_name, created_at){

    var defer = q.defer();

        user_Model.insertMany({ 

            email: email, 
            password: password, 
            first_name: first_name, 
            last_name: last_name,
            created_at: created_at
        
        }, function(err, dulieu){
            if(err){
                defer.reject(err);
            }
            else{

                defer.resolve(dulieu);
            }
        })
    return defer.promise;

}

// kiểm tra Email để đăng nhập tài khoản
function getUserByEmail(email){
    if(email){
        var defer = q.defer();

        user_Model.find({ email: email }, function(err, dulieu){
            if(err){
                defer.reject(err);

            }else{

                defer.resolve(dulieu);
            }
          })
        return defer.promise;
    }
    return false;
}

// lấy tất cả user
function getAllUser(){
    var defer = q.defer();

    user_Model.find({ }, function(err, dulieu){
        if(err){
            defer.reject(err);

        }else{

            defer.resolve(dulieu);
        }
        })
    return defer.promise;
}

module.exports = { 
    addUser: addUser,
    getUserByEmail: getUserByEmail,
    getAllUser: getAllUser
 };

