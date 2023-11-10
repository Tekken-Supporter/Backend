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
const userRouter = require('./routes/user');
const characterRouter = require('./routes/character');
const rankingRouter = require('./routes/ranking');
const challengeRouter = require('./routes/challenge');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname ,"..","Frontend")));

let corsOptions = {
    origin: ['null', '*', 'http://localhost:3000','http://localhost:5500'],
    credentials: true
}

app.use(cors(corsOptions));

app.use('/auth', authRouter);
app.use('/character', characterRouter);
app.use('/user', userRouter);
app.use('/ranking', rankingRouter);
app.use('/chellenge',challengeRouter )

db.connect();

app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.sendFile(path.join(__dirname,"..","Frontend","main.html"));
});

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
})

const maintain_connect = setInterval(() => {
    const connection = db.return_connection();
    connection.query("SELECT 1");
}, 360000)