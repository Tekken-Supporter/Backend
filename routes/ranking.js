const mysql = require('mysql');
const router = require('express').Router();
const db = require('../db.js');

router.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const connection = db.return_connection();//DB 연결용 connection 변수 선언
    connection.query('select group_concat(distinct name order by name) as name, tier as tier from userinfo group by tier;', (error, rows) => {
        if (error) throw error;
        res.json(rows);;
    });
});

router.get('/rank', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    const connection = db.return_connection();//DB 연결용 connection 변수 선언
    connection.query(`select name,id,champion,tier,winrate from userinfo order by tier limit 10`, (error, rows) => {
        if (error) throw error;
        res.json(rows);
    });
});

module.exports = router;