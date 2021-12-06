const express = require("express");
const app = express();
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// get code
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// listing server code
server.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});

// Socket.io Setup
const io = require("socket.io")(server);
var users = {};
io.on("connection", (socket) => {
  // user joined function
  socket.on("new-user-joined", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("user-connected", username);
    io.emit("user-list", users);
  });
  //   user left or disconnect function
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", (user = users[socket.id]));
    delete users[socket.id];
    io.emit("user-list", users);
  });
//   for messing
socket.on("message", (data)=>{
    socket.broadcast.emit("message", {user:data.user,msg:data.msg})
})
});
