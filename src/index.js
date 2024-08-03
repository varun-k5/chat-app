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

io.on('connection',(socket)=>{
    console.log('New websocket connection')
    socket.emit('message','Welcome!')
    socket.on('sendMessage',(message)=>{
        io.emit('message',message)
    })
})

server.listen(port,()=>{
    console.log(`Server is set up on port ${port}!`)
})