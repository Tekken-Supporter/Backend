const router = require('express').Router();
const jwt = require('jsonwebtoken');        //jwt 토큰
const db = require('../db');

const crypto = require('crypto');

//authRouter 테스트
router.get('/',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({
        router: "authRouter"
    });
});

function generateToken (user){
    require('dotenv').config();

    return jwt.sign({ name: user.name, id: user.id, password: user.password}, process.env.SECRETTOKEN, { expiresIn: '30 days' });
  };
  

//로그인
router.post('/login',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        //아이디와 비밀번호 저장
        const id = req.body.id;
        const hash_password = crypto.createHash('sha512').update(req.body.password).digest('base64');
        
        //DB 연결용 connection 변수 선언
        const connection = db.return_connection();
        //해당 정보에 해당하는 사용자가 있는 지 확인하는 쿼리문
        const  SQL = "Select * from userinfo where id = ? and password = ?;";

        //유저 정보 확인용 쿼리 요청
        connection.query(SQL,[id,hash_password],function(err, results, field){
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
                const token = generateToken(results[0].id, results[0].name);
                return res.status(201).json({
                    "status": "ok",
                    "message": "User logged in success.",
                    "token" : token
                })
            }
            //해당하는 사용자가 없는 경우 에러 처리
            else {
                console.error("Authentication failed due to incorrect username or password.");
                return res.status(401).json({
                    "type": "/errors/incorrect-auth-pass",
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
        const hash_password = crypto.createHash('sha512').update(req.body.password).digest('base64');
        const name = req.body.name;

        const SQL1 = "Select * from userinfo where id = ?;";

        connection.query(SQL1,[id],function(err,results,field){
            if(err){
                console.error(err.toString());
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }

            if(results[0] === undefined){
                const SQL = "insert into userinfo values (?,?,?,?,?);";

                connection.query(SQL,[name,id,hash_password, null, "Tier4"],function(err, results, field){
                    if(err){
                        console.error(err.toString());
                        return res.status(400).json({
                            "type": "/errors/incorrect-SQL-pass",
                            "title": "Incorrect query or SQL disconnect.",
                            "status": 400,
                            "detail": err.toString()
                        })
                    }

                    return res.status(201).json({
                        "status": "ok",
                        "message": "User register success.",
                    })
                })
            }

            else{
                console.error("User register failed due to duplicate user id.");
                return res.status(400).json({
                    "type": "/errors/incorrect-auth-pass",
                    "title": "Duplicate user id.",
                    "status": 400,
                    "detail": "User register failed due to duplicate user id.",
                })
            }
        })
        
    }
    catch(err){
        console.error(err.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": err.toString()
        });
    }
});

//중복 id 체크
router.post('/checkid/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const connection = db.return_connection();

        const id = req.params.id;

        const SQL1 = "Select * from userinfo where id = ?;";

        connection.query(SQL1,[id],function(err,results,field){
            if(err){
                console.error(err.toString());
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }

            if(results[0] === undefined){
                return res.status(201).json({
                    "status": "ok",
                    "message": "Not duplicate id.",
                })
            }
            else {
                return res.status(400).json({
                    "type": "/errors/incorrect-auth-pass",
                    "title": "Duplicate id",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            
        })

        
    }
    catch(err){
        console.error(err.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": err.toString()
        });
    }
});

module.exports = router;