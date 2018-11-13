const app = require('express')();
const http  = require('http').Server(app);
const io = require('socket.io')(http);

// Definition of the application port
const port = 4096

// Socket initiatlisation
io.on('connection', socket => {
    console.log('user connected : ', socket.id);
    let allSocketId = Object.keys(io.sockets.clients().connected);
    //console.log(allSocketId);
    socket.on('loaded', (data) => {
        console.log('data from client : ', data)
    })

    socket.on('user', (data)=>{
        socket.pseudo=data;
        generateListUser();
    })
    socket.on('message', (data) => {
        socket.broadcast.emit('message', data)
        //io.emit('message', data)
    })
    io.emit('userList', allSocketId)
    function generateListUser(){
        var userList = [];
        //console.log(userList);
        var clientList = io.sockets.clients().connected
        Object.entries(clientList).forEach(element => {
            let pseudo = element[1].pseudo;
            let id = element[1].id;
            userList.push({'id': id, 'pseudo': pseudo})
        });
        io.emit('generateList', userList)
    }
});

// Route for the chat
app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/views/index.html');
});

http.listen(port, ()=> {
    console.log('Server is up and running on http://localhost:'+port);
}); 