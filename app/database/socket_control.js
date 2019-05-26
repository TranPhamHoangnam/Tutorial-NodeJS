module.exports = function(io){

    var mang_username = [];

    io.on("connection", function(socket){

        console.log("đã có kết nối: " + socket.id);

        // lắng nghe sự kiện add user
        socket.on("add-user", function(data){

            socket.username = data; // lưu trữ thôi, không có gì cả ^^

            mang_username.push(data); // push username vào mảng

            var guive  = {
                sender: "SERVER",
                messege: "Bạn đã tham gia vào chat"
            }

            // gửi cho người gửi
            socket.emit("update-message", guive);

            // gửi cho tất cả trừ người gửi
            var guive_all = {
                sender: "SERVER",
                messege: data + " vừa tham gia chat"
            }
            socket.broadcast.emit("update-message", guive_all);

        })

        // lắng nghe sự kiện client gửi message
        socket.on("send-message", function(data){

            // gửi cho người gửi
            var guive = {
                sender: "You",
                messege: data
            }
            socket.emit("server-send-message", guive)

            // gửi cho tất cả trừ người gửi
            var guive_all = {

                sender: socket.username,
                messege: data
            }
            socket.broadcast.emit("server-send-message", guive_all)
        })

        // disconntect
        socket.on("disconnect", function(){
            for(var i = 0; i < mang_username.length; i++){
                if(username[i] == socket.username){
                    username.splice(i, 1);
                }
            }

            var data ={ 
                sender: "SERVER",
                messege: socket.username + " đã thoát"
            }

            // gửi cho tất cả trừ người gửi
            socket.broadcast.emit("server-send-message", data)
        })

    })
}