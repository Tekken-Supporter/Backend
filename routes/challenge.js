const router = require('express').Router();
const db = require('../db');

//challenge Router 테스트
router.get('/',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({
        router: "challengeRouter"
    });
});

//챌린지 신청
router.post('/apply',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const challenger = req.body.challenger;
        const defender = req.body.defender;
        const applyMessage = req.body.applyMessage;

        const SQL = "INSERT INTO challenge (challenger, contender, applyMessage) values (?,?,?);";
        const connection = await db.return_connection();

        connection.query(SQL,[challenger,defender,matchDate,applyMessage],function(err,results,field){
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
                status: 200,
                message: "챌린지 신청 완료"
            });
        })

    }
    catch(e){
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": err.toString()
        })
    }
});

//챌린지 확인
router.get('/check/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{

        const user_id = req.params.id;
        const SQL = "Select * from challenge where challenger = (SELECT name from userinfo where id = ?) or contender = (SELECT name from userinfo where id = ?) order BY challenge_id;";
        const connection = await db.return_connection();

        connection.query(SQL,[user_id, user_id],function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }

            const challenge_list = [];

            results.foreach((challenge)=>{
                //if(challenge.challenger === )
            })
        })

        res.status(200).json({
            status: 200,
            message: "챌린지 확인",

        });
    }
    catch(e){
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": err.toString()
        })
    }

    
});

//챌린지 날짜 확정
router.post('/date',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        res.status(200).json({
            message: "챌린지 날짜 확정"
        });
    }
    catch(e){
        console.error(e.toString());
        return res.status(500).json({
            "type": "/errors/incorrect-server-pass",
            "title": "Internal Server Error.",
            "status": 500,
            "detail": err.toString()
        })
    }

    
});

module.exports = router;