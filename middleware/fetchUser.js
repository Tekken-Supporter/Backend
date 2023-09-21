const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const JWT_KEY = process.env.SECRETTOKEN;

// 요청의 authorization 헤더로부터 토큰을 검증한 뒤,
// 토큰을 복호화해 _id 를 찾고 해당하는 사용자를 가져와
// 라우트에서 바로 쓸 수 있도록 req.user에 할당해주는 미들웨어
// (이 미들웨어는 로그인을 해야 접근할 수 있게 할 라우트에 적용)
const fetchUserMiddleware = async (req, res, next) => {
  
  // authorization 헤더가 없는 요청이면 기각
  if (!req.headers.authorization) {
    return res.status(400).json({
        "type": "/errors/incorrect-header-pass",
        "title": "Incorrect header-type.",
        "status": 400,
        "detail": "Authentication failed due to incorrect header-type.",
    });
  }

  // 헤더에서 token 추출
  const token = req.headers.authorization.split(' ')[1];

  // 토큰 검증 & decode
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_KEY);
  } catch (e) {
    // 검증 실패
    return res.status(400).json({
        "type": "/errors/incorrect-jwt-pass",
        "title": "Bad Authentication data.",
        "status": 400,
        "detail": "Authentication failed due to incorrect jwt Token.",
    });
  }

  
  // decode 한 토큰 안의 이름 + 생일로 user를 찾음
  try {
    // ~~ 수정 필요
    const connection = db.return_connection();
    const SQL = "SELECT * FROM user WHERE name = ? and birth = ?;";
    connection.query(SQL, [decoded.name, decoded.birth], function(err,user,fields){

        // 해당 id의 유저가 없으면
        if (!user || user.length === 0) {
            return res.status(401).json({
                "type": "/errors/incorrect-user-pass",
                "title": "Incorrect username or password.",
                "status": 401,
                "detail": "Authentication failed due to incorrect username or password.",
            });
        }
        // req.user 에 user 변수 등록
        req.user = user[0];
    
        // 다음 핸들러로 이동 (미들웨어로 쓸거기 때문에)
        next();
    });
    // ~~ 수정 필요
    
  } catch (e) {
    console.error(`[${req.method}] ${req.path} in :fetchUser middleware - 에러!`, e);
    return res.status(500).json({
      error: e,
      errorString: e.toString(),
    });
  }
};

module.exports = fetchUserMiddleware;