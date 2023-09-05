const router = require('express').Router();
const jwt = require('jsonwebtoken');        //jwt 토큰
const db = require('../db');

//authRouter 테스트
router.get('/',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({
        router: "authRouter"
    });
});

//로그인
router.post('/login',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        //아이디와 비밀번호 저장
        const id = req.body.id;
        const password = req.body.password;
        
        //DB 연결용 connection 변수 선언
        const connection = db.return_connection();
        //해당 정보에 해당하는 사용자가 있는 지 확인하는 쿼리문
        const  SQL = "Select * from user where id = ? and password = ?;";

        //유저 정보 확인용 쿼리 요청
        connection.query(SQL,[id,password],function(err, results, field){
            //Query 요청 중 에러 발생 시
            if(err){
                console.error(err);
                return res.status(500).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            //요청 정상 수행
            if(results[0] !== undefined){
                const token = generateToken(results[0]);
                return res.status(200).json({
                    token : token
                })
            }
            //해당하는 사용자가 없는 경우 에러 처리
            else {
                console.error("Authentication failed due to incorrect username or password.");
                return res.status(401).json({
                    "type": "/errors/incorrect-user-pass",
                    "title": "Incorrect username or password.",
                    "status": 401,
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

//회원가입
router.post('/register',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const connection = db.return_connection();

        const id = req.body.id;
        const password = req.body.password;
        const name = req.body.name;

        const  SQL = "insert into user values (?,?,?);";

        connection.query(SQL,[id,password,name],function(err, results, field){
            if(err){
                console.error(err);
                return res.status(401).json({
                    error: err
                })
            }
            console.log(results);
            return res.status(200).json({
                success: true
            })
        })
    }
    catch(err){
        return res.status(400).json({
            error: err
        });
    }
});

module.exports = router;