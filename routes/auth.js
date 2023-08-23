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
        const connection = db.return_connection();

        const id = req.body.id;
        const password = req.body.password;

        console.log(id + " " + password);

        const  SQL = "Select exists ( select 1 from user where id = ? and password = ?) as isUser;";

        connection.query(SQL,[id,password],function(err, results, field){
            if(err){
                console.error(err);
                return res.status(401).json({
                    error: err
                })
            }
            if(results[0].isUser){
                return res.status(200).json({
                    token : "asdfsa"
                })
            }
            else {
                console.error("ID 혹은 비밀번호가 틀렸습니다.");
                return res.status(400).json({
                    error: "ID 혹은 비밀번호가 틀렸습니다."
                })
            }   
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            error: err
        });
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