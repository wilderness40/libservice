const config = require('./config')
const jwt = require('jsonwebtoken')

/* 사용자 인증을 위한 토큰을 생성한다 */
const generateToken = (user) => {
    // sign메서드(1. 사용자정보, 2. 비밀키, 3. 토큰만료기한/토큰발행기관)
    return jwt.sign({ 
        _id: user._id, // 사용자 정보 (json)
        name: user.name,
        phone: user.phone,
        isAdmin: user.isAdmin,
        cretedAt: user.cretedAt,
    },
    config.JWT_SECRET, // jwt 비밀키
     {
        expiresIn: '1d',
        issuer: 'midbar',
     }
    )
}
/* 사용자 권한을 확인한다 */
const isAuth = (req, res, next) => { // 권한확인
    const bearerToken = req.headers.authorization // 요청헤더에 저장된 토큰
    if(!bearerToken){
        res.status(401).json({ message: '토큰이 없습니다' }) // 헤더에 토큰이 없는 경우
    }else{
        const token = bearerToken.slice(7, bearerToken.length) // header authorization에서 bearer 글자 제거, 토큰만 추출
    }
    jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
        if(err && err.name == 'TokenExpiredError'){ // 토큰만료
            res.status(419).json({ code: 419, message: '토큰이 만료되었습니다'})
        }else if(err){
            res.status(401).json({ code: 401, message: '유효한 토큰이 아닙니다'})
        }
        req.user = userInfo
        next()
    })
}

/* 사용자 권한이 있는 사용자의 경우 */
const isAdmin = (req, res, next) => { // 관리자인지 확인한다
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).json({ code: 401, message: '관리자 권한이 없습니다'})
    }
}

module.exports = {
    generateToken,
    isAuth,
    isAdmin,
}