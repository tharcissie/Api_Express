require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = process.env.PORT || 5000
const path = require('path')
const logger = require('./middleware/logger')//our custom middleware
const error = require('./middleware/error')//our custom middleware
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const credentials = require('./middleware/credentials');


connectDB()


app.use(credentials)
app.use(cors())
app.use(cookieParser())
app.use(express.json())//built-in middleware for json
app.use(bodyParser.urlencoded({extended: true}))//middleware to handle urlencoded data like form data
app.use('/',express.static(path.join(__dirname, '/public')))//middleware for public files like css
//custom middleware logger
app.use(logger)




app.use('/', require('./routes/route'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))
app.use('/users', require('./routes/api/users'));





app.all('*', (req, res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'..', 'views', '404.html'))
    }else if(req.accepts('json')){
        res.json({error:"404 Not Found"})
    }else{
        res.type('txt').send("404 Not Found")
    }
})


app.use(error)

mongoose.connection.once('open',()=>{
    console.log('connected to mangodb')
    app.listen(PORT, () =>{
        console.log('server is running on porst 5000')
    })
})

// app.listen(PORT, () =>{
//     console.log('server is running on porst 5000')
// })