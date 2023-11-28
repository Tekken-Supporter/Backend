const mysql = require('mysql');
const router = require('express').Router();
const db = require('../db.js');

router.get('/', async(req,res)=> {
    res.header("Access-Control-Allow-Origin", "*");

    try{
        const SQL = "SELECT GROUP_CONCAT(DISTINCT name ORDER BY name) AS name, CASE WHEN tier = 'Currrent_King' THEN 'current_king' WHEN tier = 'Zate_Keeper' THEN 'gatekeeper' ELSE tier END AS tier FROM userinfo GROUP BY tier;";
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

router.route('/rank')//review 기능 CRUD
  .get(async (req, res) => {//리뷰 조회(검색 가능, READ)
    res.header("Access-Control-Allow-Origin", "*");

    try{
        
        const SQL = "select name,id,champion,tier,winrate from userinfo order by tier limit 10;";
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
})

  .put(async (req, res) => {//리뷰 조회(검색 가능, READ)
    // try{
    //     const username = req.body.username;
    //     const connection = await db.return_connection();

    //     // userinfo 테이블에서 승리한 매치의 승리 판 수, 패배한 매치의 승리 판 수, 승리한 매치의 패배 판 수, 패배한 매치의 패배 판 수를 가져오는 쿼리
    //     const SQL = `
    //         SELECT
    //         (SELECT COALESCE(SUM(winscore), 0) FROM matches WHERE winner = ?) as win_match_win_games,
    //         (SELECT COALESCE(SUM(losescore), 0) FROM matches WHERE loser = ?) as lose_match_win_games,
    //         (SELECT COALESCE(SUM(losescore), 0) FROM matches WHERE winner = ?) as win_match_lose_games,
    //         (SELECT COALESCE(SUM(winscore), 0) FROM matches WHERE loser = ?) as lose_match_lose_games
    //         FROM matches WHERE winner = ? OR loser = ?;
    //     `;

    //     connection.query(SQL, [username, username, username, username, username, username], (err,results,field) => {
    //         if(err){
    //             console.error(err);
    //             return res.status(400).json({
    //                 "type": "/errors/incorrect-SQL-pass",
    //                 "title": "Incorrect query or SQL disconnect.",
    //                 "status": 400,
    //                 "detail": err.toString()
    //             })
    //         }

    //         const win_match_win_games = results[0].win_match_win_games;
    //         const lose_match_win_games = results[0].lose_match_win_games;
    //         const win_match_lose_games = results[0].win_match_lose_games;
    //         const lose_match_lose_games = results[0].lose_match_lose_games;

    //         // Winrate 계산
    //         const winrate = (win_match_win_games + lose_match_win_games) / (win_match_win_games + lose_match_win_games + win_match_lose_games + lose_match_lose_games);

    //         // userinfo 테이블의 Winrate 값을 업데이트하는 쿼리
    //         const SQL_update = 'UPDATE userinfo SET Winrate = ? WHERE name = ?';

    //         connection.query(SQL_update, [winrate, username], (err,results,field) => {
    //             if(err){
    //                 console.error(err);
    //                 return res.status(400).json({
    //                     "type": "/errors/incorrect-SQL-pass",
    //                     "title": "Incorrect query or SQL disconnect.",
    //                     "status": 400,
    //                     "detail": err.toString()
    //                 })
    //             }
    //             res.status(200).json({ 
    //                 status: "ok",
    //                 message: 'Winrate updated successfully.' 
    //             });
    //         })
    //     })
    // }
    // catch(e){
    //     console.error(e.toString());
    //     return res.status(500).json({
    //         "type": "/errors/incorrect-server-pass",
    //         "title": "Internal Server Error.",
    //         "status": 500,
    //         "detail": e.toString()
    //     })
    // }

    try {
        const connection = await db.return_connection();
      
        // userinfo 테이블의 모든 사용자 이름을 가져오는 쿼리
        const usernamesQuery = 'SELECT name FROM userinfo';
      
        const usernames = await new Promise((resolve, reject) => {
          connection.query(usernamesQuery, (err, results, field) => {
            if (err) reject(err);
            else resolve(results.map(result => result.name));
          });
        });
      
        // 각 사용자에 대해 Winrate를 업데이트
        for (const username of usernames) {
          const SQL = `
            SELECT
              COALESCE(SUM(CASE WHEN winner = ? THEN winscore ELSE 0 END), 0) as win_match_win_games,
              COALESCE(SUM(CASE WHEN loser = ? THEN losescore ELSE 0 END), 0) as lose_match_win_games,
              COALESCE(SUM(CASE WHEN winner = ? THEN losescore ELSE 0 END), 0) as win_match_lose_games,
              COALESCE(SUM(CASE WHEN loser = ? THEN winscore ELSE 0 END), 0) as lose_match_lose_games
            FROM matches WHERE winner = ? OR loser = ?;
          `;
      
          const results = await new Promise((resolve, reject) => {
            connection.query(SQL, [username, username, username, username, username, username], (err, results, field) => {
              if (err) reject(err);
              else resolve(results);
            });
          });
      
          const win_match_win_games = results[0].win_match_win_games;
          const lose_match_win_games = results[0].lose_match_win_games;
          const win_match_lose_games = results[0].win_match_lose_games;
          const lose_match_lose_games = results[0].lose_match_lose_games;
      
          // 분모 또는 분자 값이 0이 아닌지 확인하고 Winrate 계산
          const denominator = win_match_win_games + lose_match_win_games + win_match_lose_games + lose_match_lose_games;
          const winrate = denominator !== 0 ? (win_match_win_games + lose_match_win_games) / denominator : 0;
      
          // userinfo 테이블의 Winrate 값을 업데이트하는 쿼리
          const SQL_update = 'UPDATE userinfo SET Winrate = ? WHERE name = ?';
      
          await new Promise((resolve, reject) => {
            connection.query(SQL_update, [winrate, username], (err, results, field) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      
        res.status(200).json({
          status: "ok",
          message: 'Winrates updated successfully.'
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

