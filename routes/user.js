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
                    "tier": results[0].tier,
                    "winrate": results[0].winrate
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
        const now_hash_password = crypto.createHash('sha512').update(req.body.nowpassword).digest('base64');
        const new_hash_password = crypto.createHash('sha512').update(req.body.newpassword).digest('base64');
        const champion = req.body.champion;
        
        //DB 연결용 connection 변수 선언
        const connection = db.return_connection();

        //해당 정보에 해당하는 사용자가 있는 지 확인하는 쿼리문
        const SQL = "update userinfo set password = ?, champion = ? where id = ? and password = ?;";

        //유저 정보 확인용 쿼리 요청
        connection.query(SQL,[new_hash_password, champion, id, now_hash_password],function(err, results, field){
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
                    "check": "yes",
                    "message": "Query Success",
                })
            }

            else{
                return res.status(200).json({
                    "status": "ok",
                    "check": "no",
                    "message": "wrong now password",
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

//사용자 최근 전적 검색
router.get('/match/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const user_id = req.params.id;

        const connection = await db.return_connection();
        const SQL = "SELECT * FROM matches where loser = (SELECt name from userinfo where id = ?) OR winner = (SELECt name from userinfo where id = ?) ORDER BY match_id LIMIT 10;";

        connection.query(SQL, [user_id, user_id], function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            return res.status(200).json({
                results
            })
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