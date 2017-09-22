// 先创建一个http server
var app = require("http").createServer();
// 将http包装成io
var io = require("socket.io")(app);
// 端口号
var PORT = 3000;
// 连接人数唯一标识
var clientCount = 0;
// 监听端口
app.listen(PORT);

// 当有人连接上的话->连接标识进行增加，服务端广播数据
// socket.io自带的开启与关闭链接事件：on.("connection",fun)
io.on("connection",function (socket){
	// 连接标识增加
	clientCount++;
	// 拼接链接标识
	socket.nickName = "user" + clientCount;
	// io.emit为广播，socket.io为发送。广播数据key: enter
	io.emit('enter',socket.nickName + "come in");
	// 响应前台拿到的数据：message，进行处理后再广播出去
	socket.on('message',function (str){
		// 进行广播，前端应使用on函数接收key: messages
		io.emit('message',socket.nickName + "says: " + str);
	});
	// 链接关闭数据：disconnect
	socket.on('disconnect',function (){
		// 进行广播，前端应使用on函数接收key: leave
		io.emit("leave" + socket.nickName + "left");
	})
});

console.log('websocket server listening on port ' + PORT);