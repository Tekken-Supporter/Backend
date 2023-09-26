const router = require('express').Router();
const db = require('../db');

const crypto = require('crypto');

//userRouter 테스트
router.get('/',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({
        router: "authRouter"
    });
});

//로그인
router.get('/info/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{

        //header 토큰 사용시
        //const token = req.headers.authorization.split(' ')[1];

        const id = req.params.id;
        
        //DB 연결용 connection 변수 선언
        const connection = db.return_connection();
        //해당 정보에 해당하는 사용자가 있는 지 확인하는 쿼리문
        const  SQL = "Select * from userinfo where id = ?;";

        //유저 정보 확인용 쿼리 요청
        connection.query(SQL,[id],function(err, results, field){
            //Query 요청 중 에러 발생 시
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            //요청 정상 수행
            if(results[0] !== undefined){
                return res.status(200).json({
                    "status": "ok",
                    "message": "Userinfo access success  .",
                    "name": results[0].name,
                    "id": results[0].id,
                    "password": results[0].password,
                    "champion": results[0].champion,
                    "tier": results[0].tier
                })
            }
            //해당하는 사용자가 없는 경우 에러 처리
            else {
                console.error("Authentication failed due to incorrect username or password.");
                return res.status(400).json({
                    "type": "/errors/incorrect-user-pass",
                    "title": "Incorrect username or password.",
                    "status": 400,
                    "detail": "Authentication failed due to incorrect username or password.",
                })
            }   
        })
    }
    //API 처리 중 에러 발생 시
    catch(err){
        console.error(err);
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": err.toString()
        })
    }
});

//사용자 정보 수정
router.put('/updateinfo/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{

        //header 토큰 사용시
        //const token = req.headers.authorization.split(' ')[1];

        const id = req.params.id;
        const hash_password = crypto.createHash('sha512').update(req.body.password).digest('base64');
        const name = req.body.name;
        const champion = req.body.champion;
        
        //DB 연결용 connection 변수 선언
        const connection = db.return_connection();
        //해당 정보에 해당하는 사용자가 있는 지 확인하는 쿼리문
        const  SQL = "update userinfo set password = ?, name = ?, champion = ? where id = ?;";

        //유저 정보 확인용 쿼리 요청
        connection.query(SQL,[hash_password, name, champion, id],function(err, results, field){
            //Query 요청 중 에러 발생 시
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }

            //컬럼을 수정했다면 
            if(reulsts[0].affectedRows === 1){
                return res.status(200).json({
                    "status": "ok",
                    "message": "Query Success",
                })
            }

            else{
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect userid or body-data.",
                    "status": 400,
                    "detail": err.toString()
                })
            }

        })
    }
    //API 처리 중 에러 발생 시
    catch(err){
        console.error(err);
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": err.toString()
        })
    }
});

module.exports = router;