const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const cors = require('cors');
const path = require('path');

//const HTTP_PORT = 80;
//const HTTPS_PORT = 443;
//const https = require('https');

const db = require('./db');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');

app.use(bodyParser.json());

let corsOptions = {
    origin: ['*', 'null'],
    credentials: true
}

app.use(cors(corsOptions));

app.use('/auth',authRouter);


db.connect();


/*
const httpsOptions = {
    key: fs.readFileSync('./rootca.key'),
    cert: fs.readFileSync('./rootca.crt')
}
*/



app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.status(200).json({
        success: true
    })
    //res.sendFile(__dirname + "/Frontend/main.html");
});

app.listen(port, ()=>{
    console.log(`server is listening at localhost:${port}`);
})

const maintain_connect = setInterval(()=>{
    const connection = db.return_connection();
    connection.query("SELECT 1");
},360000)