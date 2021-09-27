const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

// Emit => emitir alguma info
// On => escutar alguma info


const usernameDiv = document.getElementById("username");
usernameDiv.innerHTML = `Olá, ${username}!`

socket.emit("select_room", {
    username,
    room
},
    (response) => {
        response.forEach(response => createMessage(response))
    }
);

document.getElementById("message_field").addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        const message = event.target.value;

        const data = {
            room,
            message,
            username
        }

        socket.emit("message", data);
        event.target.value = "";
    }
})

socket.on("message", data => {
    createMessage(data);
})

function createMessage(data) {
    const messageDiv = document.getElementById("messages");

    messageDiv.innerHTML += `
    <div class = "new_message">
    <label class = "form=label">
        <strong>${data.username}: </strong> <span> ${data.text} - ${dayjs(data.createdAt).format("DD/MM HH:mm")} </span>
    </label>
    </div>
    `;
}