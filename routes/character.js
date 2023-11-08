const mysql = require('mysql');
const router = require('express').Router();
var bodyParser = require('body-parser');

const db = require('../db.js');

router.get('/main', async(req,res)=> {
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const SQL = "SELECT c_name, difficulty FROM champion;";
        const connection = await db.return_connection();

        connection.query(SQL, function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            res.status(200).json(results);
        })
    }
    catch(e){
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": e.toString()
        })
    }
});

router.get('/info', async(req,res)=> {
    res.header("Access-Control-Allow-Origin", "*");
    // const connection = db.return_connection();//DB 연결용 connection 변수 선언
    // connection.query(`SELECT * FROM champion WHERE c_name = '${req.query.c_name}'`, (error, rows) => {
    //     if (error) throw error;
    //     res.send(rows);
    // });

    try{
        const SQL = "SELECT * FROM champion WHERE c_name = '?'";
        const connection = await db.return_connection();

        const c_name = req.query.c_name;

        connection.query(SQL,[c_name],function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            res.status(200).json(results);
        })
        
    }
    catch(e){
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": e.toString()
        })
    }
});

router.get('/review', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const SQL = "select * from review;";
        const connection = db.return_connection();//DB 연결용 connection 변수 선언
    
        connection.query(SQL,function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            res.status(200).json(results);
        })
    }
    catch(e){
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": e.toString()
        })
    }

});

router.post('/review', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const c_name = req.body.c_name;
        const id = req.body.id;
        const reviewData = req.body.reviewData;
        const creationTime = new Date();
    
        const SQL = "INSERT INTO review (c_name, id, reviewData, CreationTime) values (?,?,?,?);";
        const connection = db.return_connection();//DB 연결용 connection 변수 선언
    
        connection.query(SQL,[c_name,id,reviewData, creationTime],function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            res.status(200).json({
                "c_name": c_name,
                "id": id,
                "reviewData" : reviewData,
                "creationTime" : creationTime
            });
        })
    }
    catch(e){
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": e.toString()
        })
    }

});

// //- for mock-up data
// router.get('/review', function (req, res) {
//     res.header("Access-Control-Allow-Origin", "*");
//     const connection = db.return_connection();//DB 연결용 connection 변수 선언
//     res.json({
//         "c_name": "Katarina",
//         "id": "umjunsik",
//         "reviewData": "카타리나 하단 사기콤보 오바임 너프좀;;",
//         "creationTime": "2020-02-20 02:20:02 AM"
//     })
// });

module.exports = router;