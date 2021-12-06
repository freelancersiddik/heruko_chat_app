const socket = io();
const chats = document.querySelector(".chats");
const user_list = document.querySelector(".user_list");
const totol_user = document.querySelector(".totol_user");
const user_msg = document.querySelector("#user_msg");
const send_msg = document.querySelector("#send_msg");

var username;
do {
  username = prompt("Enter Your Name: ");
} while (!username);
socket.emit("new-user-joined", username);

socket.on("user-connected", (socket_name) => {
  userjoinLeft(socket_name, "Joined");
});
function userjoinLeft(name, status) {
  let div = document.createElement("div");
  div.classList.add("join_user");
  let content = `<p><b>${name}</b> ${status} The Chat</p>`;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight;
}

// for left user
socket.on("user-disconnected", (user) => {
  userjoinLeft(user, "Left");
});

socket.on("user-list", (users) => {
  user_list.innerHTML = "";
  user_arr = Object.values(users);
  for (let i = 0; i < user_arr.length; i++) {
    let p = document.createElement("p");
    p.innerHTML = user_arr[i];
    user_list.appendChild(p);
  }
  totol_user.innerHTML = user_arr.length;
});

// for message
send_msg.addEventListener("click", () => {
  let data = {
    user: username,
    msg: user_msg.value,
  };
  if (user_msg.value != "") {
    appendMessage(data, "outgoing");
    socket.emit("message", data);
    user_msg.value = "";
  }
});

function appendMessage(data, status) {
  let div = document.createElement("div");
  div.classList.add("message", status);
  let content = `
       <p><b>${data.user}</b></p>
        <p>${data.msg}</p>
    `;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight;
}
socket.on("message", (data) => {
  appendMessage(data, "incoming");
});
