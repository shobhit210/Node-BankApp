const express = require('express');
const session = require('express-session')
const dataServices = require('./services/data.service')
const app = express();
app.use(express.json());
app.use(session({
    secret:'randomsecurestring',
    resave:false,
    saveUninitialized:
}))

// app.get('/',(req,res) => {
//     res.send("THIS IS GET METHOD");
// })

// app.post('/',(req,res) => {
//     res.send("POST METHOD")
// })

// app.patch('/',(req,res) => {
//     res.send("PATCH METHOD")
// })

app.post('/register',(req,res)=>{
    console.log(req.body);
    const result = dataServices.register(req.body.acno,req.body.uname,req.body.password)
    res.status(result.statusCode).json(result)
})


app.post('/login',(req,res)=>{
    console.log(req.body);
    const result = dataServices.login(req.body.acno,req.body.pswd)
    res.status(result.statusCode).json(result)
})


app.post('/deposit',(req,res)=>{
    console.log(req.body);
    const result = dataServices.deposit(req.body.acno,req.body.pswd,req.body.amt)
    res.status(result.statusCode).json(result)
})


app.post('/withdrawal',(req,res)=>{
    console.log(req.body);
    const result = dataServices.withdrawal(req.body.acno,req.body.pswd,req.body.amt)
    res.status(result.statusCode).json(result)
})


app.listen(3000,() => {
    console.log("server started at port number: 3000");
})