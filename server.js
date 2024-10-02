
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
//var session = require('express-session')
var jwt = require('jsonwebtoken');
const { decode } = require('punycode')
let Users = [
    {
        username:'butler',
        password:'123'
    },
    {
        username:'roy',
        password:'456'
    },
]

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.options('*',cors())
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
app.use(cookieParser())
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 30 * 60 * 1000 }
//   }))

function checkLogin(req,res,next){
    let token = req.cookies.token
    if(token){
        jwt.verify(token,'vasu',(err,decode) => {
             if(err){
               res.sendFile(__dirname+"/login.html")
             }else{
               req.username = decode.username
               req.token = token 
               next()
             }
        })
    }else{
        res.sendFile(__dirname+"/login.html")
    }
 }

app.get('/',(req,res) => {
   // res.sendFile(__dirname+"/home.html")
   if(req.cookies.token ){
    res.sendFile(__dirname+"/home.html")
   }else{
    res.sendFile(__dirname+"/login.html")
   }
  
})


app.get('/phone.jpg',(req,res) => {
    res.sendFile(__dirname+"/phone.jpg")
})

app.get('/aboutus',(req,res) => {
    res.sendFile(__dirname+"/aboutus.html")
})

app.get('/login',(req,res) => {
    console.log('login::',req.query)
    let x = Users.some((p) => {
        if(p.username === req.query.username && p.password === req.query.password){
            return true
        }
    })
    if(x){
        // res.cookie('username', req.query.username)
        // res.cookie('password', req.query.password)
        //  req.session.username = req.query.username
        //  req.session.password = req.query.password
        var token = jwt.sign({ username:req.query.username,password:req.query.password }, 'vasu',{expiresIn:'1h'});
        res.cookie('token',token,{httpOnly:true})
                res.sendFile(__dirname+"/home.html")
    }else{
        res.sendFile(__dirname+"/error.html")
    }
   
})

app.get('/careers',(req,res) => {
    res.sendFile(__dirname+"/careers.html")
})
app.get('/dummy',checkLogin,(req,res) => {
    console.log('dummy',req.cookies.token)
    res.sendFile(__dirname+"/dummy.html")
})
app.get('/pokimons',checkLogin,(req,res) => {
    console.log('pokimons',req.cookies.token)
    res.sendFile(__dirname+"/pokimons.html")
})

app.get('/countries',checkLogin,(req,res) => {
    console.log('countries',req.cookies.token)
    res.sendFile(__dirname+"/countries.html")
})

app.get('/singleProduct',(req,res) => {
    res.sendFile(__dirname+"/singleProduct.html")
})

app.get('/singlePokimon',(req,res) => {
    res.sendFile(__dirname+"/singlePokimon.html")
})

app.get('/singleCountry',(req,res) => {
    res.sendFile(__dirname+"/singleCountry.html")
})

app.get('/logout',(req,res) => {
    console.log('logout', req.cookies)
    // res.clearCookie('username')
    // res.clearCookie('password')
    res.clearCookie('token')
    //req.session.destroy()
    res.sendFile(__dirname+"/login.html")
})
const port = 3500

app.listen(port,() => {
    console.log(`server is running on port ${port}`)
})