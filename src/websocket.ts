import { io } from "./http";

interface RoomUser {
    socket_id: string;
    username: string;
    room: string;
}

interface Message {
    room: string;
    text: string;
    createdAt: Date;
    username: string;
}

const users: RoomUser[] = []
const messages: Message[] = []
io.on("connection", (socket) => {
    socket.on("select_room", (data, callback) => {

        socket.join(data.room) //Conectar usuário na sala

        const userInRoom = users.find(user => user.username === data.username && user.room === data.room)

        if (userInRoom) {
            userInRoom.socket_id = socket.id
        } else {
            users.push({ // Pegar diversos usuários e armazenar num vetor para que se integrem numa sala.
                room: data.room,
                username: data.username,
                socket_id: socket.id
            })
        }
        const messagesRoom = getMessageRoom(data.room);
        callback(messagesRoom)
    });

    socket.on("message", (data) => {
        //Salvar as msgs
        const message: Message = {
            room: data.room,
            username: data.username,
            text: data.message,
            createdAt: new Date()
        }

        messages.push(message);

        //Enviar para usuários 
        io.to(data.room).emit("message", message);


    })
});

function getMessageRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room === room);
    return messagesRoom;
}