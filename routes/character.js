const mysql = require('mysql');
const router = require('express').Router();
const db = require('../db.js');

router.get('/main', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const connection = db.return_connection();//DB 연결용 connection 변수 선언
    connection.query('SELECT c_name, difficulty from champion', (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

module.exports = router;