const express = require('express');
const session = require('express-session')
const dataServices = require('./services/data.service')

const app = express();
const cors = require('cors')

app.use(express.json())
app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))

app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false
}))

const logMiddleware = (req, res, next) => {

    if (!req.session.currentAcc) {
        return res.json({
            statusCode: 422,
            status: false,
            message: "Please log in..."
        })
    }
    next()
}

// app.get('/',(req,res) => {
//     res.send("THIS IS GET METHOD");
// })

// app.post('/',(req,res) => {
//     res.send("POST METHOD")
// })

// app.patch('/',(req,res) => {
//     res.send("PATCH METHOD")
// })

app.post('/register', (req, res) => {
    dataServices.register(req.body.acno, req.body.uname, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})


app.post('/login', (req, res) => {
    console.log(req.body);
    dataServices.login(req, req.body.acno, req.body.pswd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })

})


app.post('/deposit', logMiddleware, (req, res) => {
    console.log(req.session.currentAcc);
    dataServices.deposit(req.body.acno, req.body.pswd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


app.post('/withdrawal', logMiddleware, (req, res) => {
    console.log(req.session.currentAcc);
    dataServices.withdrawal(req, req.body.acno, req.body.pswd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


app.post('/getTransaction', logMiddleware, (req, res) => {
    console.log(req.body.acno);
    dataServices.getTransaction(req.body.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


app.delete('/deleteAcc/:acno', logMiddleware, (req, res) => {
    console.log(req.body.acno);
    dataServices.deleteAcc(req.params.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


app.listen(3000, () => {
    console.log("server started at port number: 3000");
})