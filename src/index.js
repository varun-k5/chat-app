const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage, generateLocationMessage}=require('./utils/messages')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const publicDirectoryPath=path.join(__dirname,'../public')
const port=process.env.PORT||3000

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{//when a client is connected
    console.log('New websocket connection')
        
    socket.on('join',({username,room})=>{
        socket.join(room)

        socket.emit('message',generateMessage('Welcome!'))//emit to a particular
        socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined!`))//emit all except the one
    })

    socket.on('sendMessage',(message,callback)=>{
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        
        io.emit('message',generateMessage(message))//emit all
        callback()
    })
    
    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        //io.emit('message',`Location: ${coords.latitude}, ${coords.longitude}`)
        callback()
    })

    socket.on('disconnect',()=>{//when a clent is disconnected
        io.emit('message',generateMessage('A user has left!'))
    })
})

server.listen(port,()=>{
    console.log(`Server is set up on port ${port}!`)
})