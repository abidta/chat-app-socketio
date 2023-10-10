var socket = io();
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var user = document.getElementById("name");
var randomColor = Math.floor(Math.random() * 16777215).toString(16);
var logoutBtn = document.getElementById("logout-btn");

fetch("/get-session")
  .then((res) => res.json())
  .then((isSession) => {
    if (isSession) {
      console.log(isSession, "session");
      form.style.display = "flex";
      document.getElementById("name-form").style.display = "none";
      logoutBtn.style.display = "flex";
    }
  })
  .catch((err) => {
    console.log(err);
  });
document.getElementById("name-form").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(user);
  console.log(socket.id);
  if (user.value) {
    socket.emit("login", user.value, (err) => {
      if (!err) {
        console.log("cb success");
        form.style.display = "flex";
        document.getElementById("name-form").style.display = "none";
        logoutBtn.style.display = "flex";
      } else {
        console.log(err);
        document.getElementById("error-name").innerHTML = err;
      }
    });
    user.value = "";
  }
});
logoutBtn.addEventListener("click", async (e) => {
  await fetch("/logout", {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (res.redirected) {
      location.href = "/";
    }
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value, randomColor);
    input.value = "";
  }
});
socket.on("chat message", function ({ name, msg, color }) {
  var item = document.createElement("li");
  var msgElemnt = document.createElement("span");
  item.textContent = name;
  msgElemnt.textContent = " : " + msg;
  msgElemnt.style.color = "black";
  item.style.color = "#" + color;
  messages.appendChild(item);
  item.appendChild(msgElemnt);
  window.scrollTo(0, document.body.scrollHeight);
});
