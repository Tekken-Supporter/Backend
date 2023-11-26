const router = require('express').Router();
const db = require('../db');

//challenge Router 테스트
router.get('/',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
        router: "challengeRouter"
    });
});

//챌린지 신청 가능 목록
router.get('/name/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const user_id = req.params.id;

        const SQL = "Select tier from userinfo where id = ?;";
        const connection = await db.return_connection();

        connection.query(SQL,[user_id],function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }

            const tier = results[0].tier;

            if(tier === "Current_King"){
                return res.status(200).json({
                    status: "ok",
                    message: "챔피언은 방어전 수락만 가능합니다.",
                    namelist: []
                });
            }
            else{
                const tierlist = ["Current_King", "Tier1", "Tier2", "Tier3", "Tier4", "Zate_Keeper"];
            
                const SQL2 = "Select group_concat(name) as name from userinfo where tier = ?;";

                connection.query(SQL2,[tierlist[tierlist.indexOf(tier)-1]],function(err,results,field){
                    if(err){
                        console.error(err);
                        return res.status(400).json({
                            "type": "/errors/incorrect-SQL-pass",
                            "title": "Incorrect query or SQL disconnect.",
                            "status": 400,
                            "detail": err.toString()
                        })
                    }
                    const namelist = results[0].name.split(',');
                    return res.status(200).json({
                        status: "ok",
                        message: "챌린지 신청 가능 목록",
                        namelist: namelist
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

//챌린지 신청
router.post('/apply',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const challenger = req.body.challenger;
        const contender = req.body.contender;
        const applymessage = req.body.applymessage;
        const matchDate = req.body.matchdate;
        const creationDate = new Date();

        const SQL = "INSERT INTO challenge (challenger, contender, applymessage, matchDate, creationDate) values (?,?,?,?,?);";
        const connection = await db.return_connection();

        connection.query(SQL,[challenger,contender,applymessage,matchDate,creationDate],function(err,results,field){
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
                status: "ok",
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
router.get('/accept/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const challenge_id = req.body.challenge_id;

        const SQL = "update table_name challenge set check1 = 1 where challenge_id=?;";
        const SQL2 = "insert into matches (match_id, loser, winner, winscore, losescore) values (?, ?, ?, ?, ?)"
        const connection = await db.return_connection();

        connection.query(SQL,[challenge_id, null, null, 0, 0],function(err,results,field){
            if(err){
                console.error(err);
                return res.status(400).json({
                    "type": "/errors/incorrect-SQL-pass",
                    "title": "Incorrect query or SQL disconnect.",
                    "status": 400,
                    "detail": err.toString()
                })
            }
            connection.query(SQL2,[challenge_id, null, null, 0, 0],function(err,results,field){
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
                    status: "ok",
                    message: "챌린지 수락 완료"
                });
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

//받은 챌린지 확인
router.get('/check/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{

        const user_id = req.params.id;

        const SQL = "Select * from challenge where contender = (Select name from userinfo where id = ?) and check1 = 1 order by challenge_id";

        const connection = await db.return_connection();

        connection.query(SQL,[user_id],function(err,results,field){
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
                status: "ok",
                message: "도전 요청 리스트",
                challengeList: results
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

//보낸 챌린지 확인
router.get('/send/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{

        const user_id = req.params.id;

        const SQL = "Select * from challenge where challenger = (Select name from userinfo where id = ?) order by challenge_id desc";

        const connection = await db.return_connection();

        connection.query(SQL,[user_id],function(err,results,field){
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
                status: "ok",
                message: "보낸 요청 리스트",
                challengeList: results
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


//챌린지 결과 확인
router.post('/result',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{

        const challenge_id = req.body.challenge_id;
        const challenger = req.body.challenger;
        const contender = req.body.contender;
        const score_challenger = req.body.score_challenger;
        const score_contender = req.body.score_contender;

        const SQL = "Select * from challenge where challenge_id = ?";

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

            const SQL_array = [];

            if(score_challenger===3){
                SQL_array.push(challenger, contender, score_challenger, score_contender);
            }
            else{
                SQL_array.push(contender, challenger, score_contender, score_challenger);
            }
            
            /*
            //승률 업데이트 필요
            const SQL_UpdateTier = "update userinfo set tier = (Select tier from userifo where name = ?) where name = ?";
            connection.query(SQL_UpdateTier, [challenger,contender] ,function(err,results,field){
                if(err){
                    console.error(err);
                    return res.status(400).json({
                        "type": "/errors/incorrect-SQL-pass",
                        "title": "Incorrect query or SQL disconnect.",
                        "status": 400,
                        "detail": err.toString()
                    })
                }
            })
            connection.query(SQL_UpdateTier, [contender, challenger] ,function(err,results,field){
                if(err){
                    console.error(err);
                    return res.status(400).json({
                        "type": "/errors/incorrect-SQL-pass",
                        "title": "Incorrect query or SQL disconnect.",
                        "status": 400,
                        "detail": err.toString()
                    })
                }
            })
            */

            const SQL_UpdateMatch = "update matches set winner = ?, loser = ?, winscore = ?,losescore = ? where match_id = ?;";

            connection.query(SQL_UpdateMatch, SQL_array ,function(err,results,field){
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
                    status: "ok",
                    message: "매치 결과 업데이트 완료"
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