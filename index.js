const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app=express();
const port= 4500 || process.env.PORT ;


const users=[{}];

app.use(cors());
app.get("/",(req,res)=>{
    res.send("HELL ITS WORKING");
})

const server=http.createServer(app);

const io=socketIO(server);

io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({user})=>{
          users[socket.id]=user;
          console.log(`${user} has joined `);
          socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
          socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnect',()=>{
          socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
});


server.listen(port,()=>{
    console.log(`Working on http://localhost:${port}`);
})



//output to run=========================npm start in cd server and npm start in cd cchat as server and client will chat will each other=====
//node terminal: inside server > cd server
//>npm start
//>npx create-react-app cchat 
//another powershell/zsh terminal: >cd cchat 
//>sudo chown -R 501:20 "/Users/shailygoyal/.npm"
//>npm install socket.io-client react-scroll-to-bottom
//>npm install react-router-dom 


//deploy on netlify of frontend:
//>cd cchat: npm run build
//>npm install -g netlify-cli
//>netlify login
//>netlify deploy
// ./build
//website: https://chatconnect-app.netlify.app 