const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const publicDirectoryPath=path.join(__dirname,'../public')
const port=process.env.PORT||3000

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{//when a client is connected
    console.log('New websocket connection')
    
    socket.emit('message','Welcome!')//emit to a particular
    socket.broadcast.emit('message','A new user has joined!')//emit all except the one
    
    socket.on('sendMessage',(message)=>{
        io.emit('message',message)//emit all
    })

    socket.on('disconnect',()=>{//when a clent is disconnected
        io.emit('message','A user has left!')
    })
})

server.listen(port,()=>{
    console.log(`Server is set up on port ${port}!`)
})