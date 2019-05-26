var express = require('express');
var helper = require("../helpers/helper"); // mã hóa password

var admin = require("../models/admin");
var admin_post = require("../models/post");

var router = express.Router();


router.get("/", function(req, res){

    if(req.session.user){
        // lấy dữ liệu ra
        var ds_bai_post = admin_post.getAllPost();

        ds_bai_post.then(function(dulieu){
            var data = {

                posts: dulieu,
                error: false
            }
            res.render("admin/dashboard", { data: data });

        }).catch(function() {
            res.render("admin/dashboard", { data: { error: "Không tải được dữ liệu" } });
        })
    } else {
        res.redirect("admin/login");
    }
    
})

// ============= đăng ký
router.get("/signup", function(req, res){
    res.render("signup", { data: {} });
})

// ============= đăng nhập
router.get("/login", function(req, res){
    res.render("login", { data: {} });
})

// ============= post đăng ký
router.post("/signup", function(req, res){
    var user = req.body;

    // không điền email
    if(user.email.trim() == 0)
    {
        res.render("signup", { data: {error: "Email is requied"} });
    }
    // không trùng password
    if(user.password != user.confirmpassword && user.password.trim().length != 0)
    {
        res.render("signup", { data: {error: "Password not match"} });
    }
    
    // mã hóa password
    var password = helper.hash_password(user.password);

    // lấy ngày tháng hiện tại
    var now = new Date();
    var created_at = now;

    // insert vào DB
    var result = admin.addUser(user.email, password, user.firstname, user.lastname, created_at);

    result.then(function(dulieu){

        res.redirect("/admin/login");
    }).catch(function(err){
        
        res.render("signup", { data: {ererrorro: "err"} });
    })

})

// ============= post đăng nhập
router.post("/login", function(req, res){
    var params = req.body;

    if(params.email.trim().length == 0){
        res.render("login", { data: { error: "Bạn chưa nhập email" } })
    }
    else{
        var data = admin.getUserByEmail(params.email);
        if(data){

            data.then(function(data){
                var user = data[0];
                // giải mã password
                var status = helper.compare_password(params.password, user.password);

                if(!status){

                    res.render("login", { data: { error: "Bạn nhập sai password" } })
                }else{
                    // đẩy thông tin user vào trong session
                    req.session.user = user;
                    console.log(req.session.user);
                    
                    res.redirect("/admin");
                }
            })
        }else{

            res.render("login", { data: { error: "Email của bạn sai!!" } })
        }
    }
})


// ============= TẠO POST BÀI ĐĂNG MỚI DÙNG GET
router.get("/post/new", function(req, res){ 

    if(req.session.user){

        res.render("admin/post/new", { data: { error: false } });
    } else {

        res.redirect("/admin/login");
    }
})


// ============= TẠO POST BÀI ĐĂNG MỚI DÙNG PSOT
router.post("/post/new", function(req, res){ 

    var title = req.body.title;
    var content = req.body.content;
    var author = req.body.author;

    if(title.trim().length == 0){
        var data = {
            error: "Bạn chưa nhập title"
        };
        res.render("admin/post/new", { data: data })
    } else {

        var now = new Date();
        var created_at = now;
        var updated_at = now;

        var data = admin_post.AddPost(title, content, author, created_at, updated_at);

        data.then(function(dulieu){
            res.redirect("/admin");

        }).catch(function(err){
            var datas = {
                error: "không tạo được bài post"
            }
            res.render("admin/post/new", { data: datas })
        })

    }
    
})


// ============= SỬA BÀI VIẾT DÙNG GET
router.get("/post/edit.:id", function(req, res){ 

    if(req.session.user){
        var id_bai_viet = req.params.id;

        var post_id = admin_post.getPostByID(id_bai_viet);
        
        if(post_id){
            post_id.then(function(dulieu){

                var post = dulieu[0];
                var datas = {
                    posts: post,
                    error: false
                }

                res.render("admin/post/edit", { data: datas })
            }).catch(function(err){

                var datas = {
                    error: "không sửa được bài viết"
                }
                res.render("admin/post/edit", { data: datas })
            })

        } else {

            var datas = {
                error: "không sửa được bài viết"
            }
            res.render("admin/post/edit", { data: datas })
        }
    } else {

        res.redirect("/admin/login");
    }
})

// ============= SỬA BÀI VIẾT DÙNG POST
router.post("/post/edit.:id", function(req, res){ 

    var idCanSua = req.params.id;
    var title = req.body.title;
    var content = req.body.content;
    var author = req.body.author;

    var now = Date();
    var updated_at = now;

    var post_id = admin_post.getPostByID_Edit(idCanSua, title, content, author, updated_at);

    if(post_id){
        post_id.then(function(dulieu){

            res.redirect("/admin");
    
        }).catch(function(err){

            res.render("admin/dashboard", { data: { error: "Không tải được dữ liệu" } });
        })

    } else {

        res.render("admin/dashboard", { data: { error: "Không tải được dữ liệu" } });
    }
})

// ============= XÓA BÀI VIẾT DÙNG GET
router.get("/post/delete.:id", function(req, res){

    if(req.session.user){
        var idCanXoa = req.params.id;

        var post_id = admin_post.getPostByID_Delete (idCanXoa);

        if(post_id){
            post_id.then(function(dulieu){

                res.redirect("/admin");
        
            }).catch(function(err){

                res.render("admin/dashboard", { data: { error: "Không xóa được dữ liệu" } });
            })
        } else {

            res.render("admin/dashboard", { data: { error: "Không tải được dữ liệu" } });
        }
    } else {

        res.redirect("/admin/login");
    }

})


router.get("/post", function(req, res){
    if(req.session.user){

        res.redirect("/admin");
    } else {

        res.redirect("/admin/login");
    }
})


// lấy danh sách tất cả user
router.get("/users", function(req, res){
    
    if(req.session.user) {

        var users = admin.getAllUser();

        users.then(function(dulieu){

            var datas = {

                users: dulieu,
                error: false
            };
            res.render("admin/users", { data: datas })

        }).catch(function(err){
            var datas = {
                error: "Không tải được danh sách user"
            };
            res.render("admin/users", { data: datas });
        })
    } else {
        
        res.redirect("/admin/login");
    }
})


module.exports = router;