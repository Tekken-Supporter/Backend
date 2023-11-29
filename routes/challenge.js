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
router.post('/accept',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const challenge_id = req.body.challenge_id;
        const message = req.body.message;

        if(message === "accept"){
            const SQL = "update challenge set check1 = 1 where challenge_id=?;";
            const SQL2 = "insert into matches (match_id, loser, winner, winscore, losescore) values (?, ?, ?, ?, ?)"
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
        else{
            const SQL = "delete from challenge where challenge_id=?;";
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
                    status: "ok",
                    message: "챌린지 거절 완료"
                });
            })
        }

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

        const SQL = "Select * from challenge where contender = (Select name from userinfo where id = ?) and check1 = 0 order by challenge_id";

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
                SQL_array.push(challenger, contender, score_challenger, score_contender ,challenge_id);
            }
            else{
                SQL_array.push(contender, challenger, score_contender, score_challenger,challenge_id);
            }

            const updateWinrate = async function a(name){
                // 디코딩된 사용자 이름
                const username = name;

                // 해당 사용자의 승리, 패배, 승리한 매치의 패배 판 수, 패배한 매치의 승리 판 수를 가져오는 쿼리
                const userStatsQuery = `
                    SELECT
                    COALESCE(SUM(CASE WHEN winner = ? THEN winscore ELSE 0 END), 0) as wins,
                    COALESCE(SUM(CASE WHEN loser = ? THEN losescore ELSE 0 END), 0) as losses,
                    COALESCE(SUM(CASE WHEN winner = ? THEN losescore ELSE 0 END), 0) as win_losses,
                    COALESCE(SUM(CASE WHEN loser = ? THEN winscore ELSE 0 END), 0) as loss_losses
                    FROM matches
                    WHERE winner = ? OR loser = ?;
                `;

                const result = await new Promise((resolve, reject) => {
                    connection.query(userStatsQuery, [username, username, username, username, username, username], async (err, results, field) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
   
                });
                const wins = result[0].wins;
                const losses = result[0].losses;
                const win_losses = result[0].win_losses;
                const loss_losses = result[0].loss_losses;

                // Winrate 계산
                const denominator = wins + losses + win_losses + loss_losses;
                const winrate = denominator !== 0 ? (wins + losses) / denominator * 100 : 0;

                // userinfo 테이블의 Winrate 값을 업데이트하는 쿼리
                const updateQuery = 'UPDATE userinfo SET Winrate = ? WHERE name = ?';

                new Promise((resolve, reject) => {
                    connection.query(updateQuery, [winrate, username], (err, results, field) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }

            updateWinrate(challenger);
            updateWinrate(contender);

            
            //티어 변동
            const SQL_Tier = "select tier, name from userinfo where name = ? or name = ?;";
            
            connection.query(SQL_Tier,[challenger,contender],function(err,results,field){
                if(err){
                    console.error(err);
                    return res.status(400).json({
                        "type": "/errors/incorrect-SQL-pass",
                        "title": "Incorrect query or SQL disconnect.",
                        "status": 400,
                        "detail": err.toString()
                    })
                }
                
                if(results[0].name===challenger){
                    const tier_challenger = results[0].tier;
                    const tier_contender = results[1].tier;
                    
                    const SQL_SWAP = "update userinfo set tier = ? where name = ?;";
                    connection.query(SQL_SWAP,[tier_challenger,contender],function(err,results,field){});
                    connection.query(SQL_SWAP,[tier_contender,challenger],function(err,results,field){});
                }
                else{
                    const tier_challenger = results[1].tier;
                    const tier_contender = results[0].tier;

                    const SQL_SWAP = "update userinfo set tier = ? where name = ?;";
                    connection.query(SQL_SWAP,[tier_challenger,contender],function(err,results,field){});
                    connection.query(SQL_SWAP,[tier_contender,challenger],function(err,results,field){});
                }
            })
            

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