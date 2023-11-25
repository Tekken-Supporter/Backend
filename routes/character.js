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

router.route('/review')//review 기능 CRUD
  .get(async (req, res) => {//리뷰 조회(검색 가능, READ)
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const c_name = req.body.c_name;
        const id = req.body.id;
        const reviewData = req.body.reviewData;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        let SQL = "SELECT * FROM review";
        const conditions = [];//add 'conditions' array(prevent SQL injection)
        
        const parameters = [];

        if (c_name) {
            conditions.push('c_name = ?');
            parameters.push(c_name);
        }
        if (id) {
            conditions.push('id = ?');
            parameters.push(id);
        }
        if (reviewData) {
            conditions.push('reviewData LIKE ?');
            parameters.push(reviewData);
        }
        if (startDate && endDate) {
            conditions.push('creationTime BETWEEN ? AND ?');
            parameters.push(startDate, endDate);
        }

        if (conditions.length > 0) {
            SQL += " WHERE " + conditions.join(" AND ");
        }

        const connection = db.return_connection();//DB 연결용 connection 변수 선언
    
        connection.query(SQL,parameters,function(err,results,field){
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
  })
  .post(async (req, res) => {//리뷰 등록(CREATE)
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const c_name = req.body.c_name;
        const id = req.body.id;
        const reviewData = req.body.reviewData;
        const creationTime = new Date();
        const modifiedTime = new Date();
    
        const SQL = "INSERT INTO review (c_name, id, reviewData, CreationTime, modifiedTime) values (?,?,?,?,?);";
        const connection = db.return_connection();//DB 연결용 connection 변수 선언
    
        connection.query(SQL,[c_name,id,reviewData, creationTime, modifiedTime],function(err,results,field){
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
  })
  .delete(async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    try {
        const number = req.body.number;
        if (!number || isNaN(parseInt(number))) {
            return res.status(400).json({
                "type": "/errors/invalid-review-number",
                "title": "Invalid Review Number",
                "status": 400,
                "detail": "Review number parameter must be a valid number."
            });
        }

        const SQL = "DELETE FROM review WHERE number = ?";
        const connection = db.return_connection();

        connection.query(SQL, [parseInt(number)], function (err, results, field) {
            if (err) {
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    "type": "/errors/review-not-found",
                    "title": "Review Not Found",
                    "status": 404,
                    "detail": `Review with number ${number} not found.`
                });
            }

            return res.status(204).send();
        });
    } catch (e) {
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": e.toString()
        });
    }
})
  .put(async (req, res) => {//number에서 조회 및 접근하여 수정(UPDATE)
    res.header("Access-Control-Allow-Origin", "*");

    try {
        const number = parseInt(req.body.number);
        const reviewData = req.body.reviewData;
        const modifiedTime = new Date();

        if (!number) {
            return res.status(400).json({
                "type": "/errors/missing-review-number",
                "title": "Missing Review Number",
                "status": 400,
                "detail": "Review Number parameter is required for modification."
            });
        }

        const SQL = "UPDATE review SET reviewData = ?, modifiedTime = ? WHERE number = ?";
        const connection = db.return_connection();

        connection.query(SQL, [reviewData, modifiedTime, number], function (err, results, field) {
            if (err) {
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    "type": "/errors/review-not-found",
                    "title": "Review Not Found",
                    "status": 404,
                    "detail": `Review with ID ${number} not found.`
                });
            }

            res.status(200).json({
                "message": "Review updated successfully."
            });
        });
    } catch (e) {
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": e.toString()
        });
    }
  });

module.exports = router;