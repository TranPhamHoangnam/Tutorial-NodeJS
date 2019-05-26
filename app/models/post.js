// hàm và function để thao tác với bảng

var post_Model = require('../database/data_post');
var q = require("q"); // khai báo promise

// lấy tất cả bài post ra ==> xem dữ liệu
function getAllPost() {
    var defer = q.defer();

    post_Model.find({ }, function(err, dulieu){
        if(err){
            defer.reject(err);

        }else{

            defer.resolve(dulieu);
        }
        })
    return defer.promise;
}

// thêm mới bài viết
function AddPost(title, content, author, created_at, updated_at){
    var defer = q.defer();

    post_Model.insertMany({ 

        title: title, 
        content: content, 
        author: author, 
        created_at: created_at,
        updated_at: updated_at
    
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

// tìm ID để sửa bài viết
function getPostByID(id) {
    var defer = q.defer();

    post_Model.find({ _id: id }, function(err, dulieu){
        if(err){
            defer.reject(err);

        }else{

            defer.resolve(dulieu);
        }
        })
    return defer.promise;
}

// tìm ID để cập nhật bài viết
function getPostByID_Edit(id, title, content, author, updated_at) {
    var defer = q.defer();

    post_Model.findByIdAndUpdate({ _id: id }, { $set: { title: title, content: content, author: author , updated_at: updated_at} }, function(err, dulieu){
        if(err){
            defer.reject(err);

        }else{

            defer.resolve(dulieu);
        }
        })
    return defer.promise;
}

// tìm ID để cập xóa bài viết
function getPostByID_Delete(id) {

    if(id){
        var defer = q.defer();

        post_Model.findByIdAndRemove({ _id: id }, function(err, dulieu){
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

module.exports = {
    getAllPost: getAllPost,
    AddPost: AddPost,
    getPostByID: getPostByID,
    getPostByID_Edit: getPostByID_Edit,
    getPostByID_Delete: getPostByID_Delete
}