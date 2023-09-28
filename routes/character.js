const mysql = require('mysql');
const router = require('express').Router();
const db = require('../db.js');

router.get('/main', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const connection = db.return_connection();//DB 연결용 connection 변수 선언
    connection.query('SELECT c_name, difficulty FROM champion', (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

router.get('/info', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    const connection = db.return_connection();//DB 연결용 connection 변수 선언
    connection.query(`SELECT * FROM champion WHERE c_name = '${req.query.c_name}'`, (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

module.exports = router;