const express= require('express')
const cors = require('cors');
const app= express();
const http = require("http");
const server = http.createServer(app);
const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200
};


app.use(cors(corsOptions));

const socketIO = require("socket.io");
const io = socketIO(server);
const users = [{}];

io.on("connection", (socket)=>{

    console.log("sssssssssss",socket);

    socket.on("joined",({user})=>{
        users[socket.id] = user;
        console.log(`${user} has joined.`);
        socket.broadcast.emit('userJoined',{user:"Admin", message:`${users[socket.id]} User has joined`});
        socket.emit('welcome', {user:"Admin", message:`welcome to the chat, ${users[socket.id]}`})
    });
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id], message,id});
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave', {user:"Admin", message:`User has left`});
        console.log(`User Left, ${users[socket.id]} `);
    })


})



const userRouter= require('./router/userRouter')
const adminRouter= require('./router/adminRouter')
const registerRouter= require('./router/registerRouter')
const loginRouter= require('./router/loginRouter')
const forgotPasswordRouter= require('./router/forgotPasswordRouter')
const workSamplesRouter= require('./router/workSamplesRouter')
const authorsRouter= require('./router/authorsRouter')
const faqsRouter= require('./router/faqsRouter')
const blogRouter= require('./router/blogRouter')
const servicesRouter= require('./router/servicesRouter')
const cartRouter= require('./router/cartRouter')
const logoutRouter= require('./router/logoutRouter')
const searchworksampleRouter= require('./router/searchworksampleRouter')
const searchblogRouter= require('./router/searchblogRouter')
const changePasswodRouter= require('./router/changePasswodRouter')
const careerRouter= require('./router/careerRouter')




const jwt= require('jsonwebtoken')
const cookieParser= require('cookie-parser')
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
app.use(express.static('public'))
const dotenv = require('dotenv');
dotenv.config();
const mongoose= require('mongoose')
mongoose.connect(process.env.DATABASE,()=>{
    console.log('getpro database have connected to your project')
})

app.use(express.json())
app.use(userRouter)
app.use(adminRouter)
app.use(registerRouter)
app.use(loginRouter)
app.use(forgotPasswordRouter)
app.use(workSamplesRouter)
app.use(authorsRouter)
app.use(faqsRouter)
app.use(blogRouter)
app.use(servicesRouter)
app.use(cartRouter)
app.use(logoutRouter)
app.use(searchworksampleRouter)
app.use(searchblogRouter)
app.use(changePasswodRouter)
app.use(careerRouter)

app.listen(process.env.PORT,(req,res)=>{
    console.log("server in running on port 5000")
})

