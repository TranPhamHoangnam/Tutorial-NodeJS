var express = require('express');
var router = express.Router();

var post_md = require("../models/post");

// trang chủ blog ==> lất tất cả bài viết
router.get("/", function(req, res){

    var data = post_md.getAllPost();
    data.then(function(dulieu){
        var result = {
            posts: dulieu,
            error: false
        }
        res.render("blog/index", { data: result });
    }).catch(function(err){

        var result = {
            error: "Không Tìm thấy bài viết"
        }
        res.render("blog/index", { data: result });
    })

})

// lấy id bài viết
router.get("/post/:id", function(req, res){

    var params = req.params.id;

    var data = post_md.getPostByID(params);

    data.then(function(dulieu){
        // promise trả về 1 mảng, nên phải lấy phần tử đầu tiên
        var post = dulieu[0];

        var result = {
            posts: post,
            error: false
        }
        res.render("blog/post", { data: result });

    }).catch(function(err){

        var result = {
            error: "Không Tìm thấy bài viết"
        }
        res.render("blog/post", { data: result });
    })

})


// Tran About
router.get("/about", function(req, res){

    res.render("blog/about");
})

module.exports = router;