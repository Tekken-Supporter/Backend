const router = require('express').Router();
const db = require('../db');

//challenge Router 테스트
router.get('/',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
        router: "challengeRouter"
    });
});

//챌린지 신청
router.post('/apply',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const challenger = req.body.challenger;
        const contender = req.body.contender;
        const applymessage = req.body.applymessage;

        const SQL = "INSERT INTO challenge (challenger, contender, applymessage) values (?,?,?);";
        const connection = await db.return_connection();

        connection.query(SQL,[challenger,contender,applymessage],function(err,results,field){
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

//챌린지 수락
router.post('/accept',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const challenge_id = req.body.challenge_id;
        const acceptmessage = req.body.acceptmessage;
        const matchDate = req.body.matchDate;

        const SQL = "update table_name challenge set check1=1, check3 = 1, acceptmessage=?, matchDate = ? where challenge_id=?;";
        const connection = await db.return_connection();

        connection.query(SQL,[acceptmessage, matchDate, challenge_id],function(err,results,field){
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
                status: 200,
                message: "챌린지 수락 완료"
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

//날짜 수정
router.post('/modifydate',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const challenge_id = req.body.challenge_id;
        const matchDate = req.body.matchDate;
        const user_id = req.body.id;
        const user_name = req.body.name;

        const SQL = "Select * from challenge where challenge_id;";
        const connection = await db.return_connection();

        connection.query(SQL,[challenge_id,acceptmessage],function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }

            if(results[0].challenger === user_name){
                const SQL2 = "update table_name challenge set check2=1, check3=0, matchDate=? where challenge_id=?;";
                connection.query(SQL2,[matchDate, challenge_id],function(err,results,field){
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
                        status: 200,
                        message: "매치 날짜 수정 완료"
                    })
                })  
                
            }

            else if(results[0].contender === user_name){
                const SQL2 = "update table_name challenge set check2=0, check3=1, matchDate=? where challenge_id=?;";
                connection.query(SQL2,[matchDate, challenge_id],function(err,results,field){
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
                        status: 200,
                        message: "매치 날짜 수정 완료"
                    })
                })  
                
            }
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


//날짜 확정
router.post('/confirmdate',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const challenge_id = req.body.challenge_id;

        
        const SQL = "update table_name challenge set check2=1, check3=1 where challenge_id=?;";
        const connection = await db.return_connection();

        connection.query(SQL,[challenge_id],function(err,results,field){
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
                status: 200,
                message: "챌린지 수락 완료"
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
router.get('/check/:id/:name',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{

        const user_id = req.params.id;
        const user_name = req.params.name;

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

            return res.status(200).json({
                status:200,
                message: "도전 요청 리스트",
                challengeList: results.map((challenge)=>{
                    //challenger인 경우
                    if(challenge.challenger === user_name){
                        //매치 일정이 안 정해진 경우
                        if(challenge.check1 === 1 && challenge.check2 === 0){
                            challenge.checked = false;
                        }
                        else{
                            challenge.checked = true;
                        }
                    }
                    //contender인 경우
                    else if(challenge.contender === user_name){
                        //매치 확인이나 일정 확정을 안 한 경우
                        if(challenge.check1 === 0 || (challenge.check1 === 1 && challenge.check3 === 0)){
                            challenge.checked = false;
                        }
                        else{
                            challenge.checked = true;
                        }
                    }
                })
            })
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

module.exports = router;