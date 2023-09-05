const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

//const HTTP_PORT = 80;
//const HTTPS_PORT = 443;
//const https = require('https');

const db = require('./db');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');

app.use(bodyParser.json());

app.use('/auth',authRouter);


db.connect();


const cors = require('cors');
let corsOptions = {
    origin: ['*', 'null'],
    credentials: true
}

app.use(cors(corsOptions));

/*
const httpsOptions = {
    key: fs.readFileSync('./rootca.key'),
    cert: fs.readFileSync('./rootca.crt')
}
*/

app.get('/', (req, res) => {
    res.json({ message: `Server is running on port ${port}` });
});

app.listen(port, ()=>{
    console.log(`server is listening at localhost:${port}`);
})