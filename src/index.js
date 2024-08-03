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
let count=0

io.on('connection',(socket)=>{
    console.log('New websocket connection')
    socket.emit('countUpdated',count)
    socket.on('increment',()=>{
        count++
        //socket.emit('countUpdated',count)//emit to a single connection
        io.emit('countUpdated',count)
    })
})
server.listen(port,()=>{
    console.log(`Server is set up on port ${port}!`)
})