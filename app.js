var express = require('express'); // phải có
var config = require('config'); // dùng để cấu hình những thứ gì đó dùng mặc định như Port hay DB
var bodyParser = require('body-parser'); // dùng để lấy thông tin từ form
var mongoose = require('mongoose');
var session = require('express-session');
var socketio = require('socket.io');

var app = express();


// cấu hình bodyParser cho form
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// cấu hình session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // có thể save được dữ liệu khác vào
}))

// cấu hình cho views EJS
app.set("views", __dirname + "/app/views");
app.set("view engine", "ejs");

// cấu hình static folder public
app.use("/static", express.static(__dirname + "/public"));

// cấu hình để gọi cho router
var controller = require(__dirname + '/app/controllers');
app.use(controller);

// cấu hình database
mongoose.connect(`mongodb://${config.get("mongoDB.host")}:${config.get("mongoDB.port")}/${config.get("mongoDB.database")}`, {useNewUrlParser: true}).then(() => {
    console.log(`Đã kết nối DB ${config.get("mongoDB.database")}`);
}).catch((err) => {
    console.log(`Không kết nối được tới DB`);
});
mongoose.set('useFindAndModify', false);

// cấu hình config để gọi cái gì đó sử dụng mặc định
var host = config.get("server.host");
var port = config.get("server.port");
var server = app.listen( process.env.PORT || port, host, function(){
    console.log("server is running on port " + port);
})

// khởi tạo socketio
var io = socketio(server);
var socket_controll = require ("./app/database/socket_control")(io); // hàm khởi tạo
